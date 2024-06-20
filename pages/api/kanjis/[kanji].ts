import clientPromise from "../../../lib/mongodb";
import NextCors from 'nextjs-cors';

const fn = async (req: any, res: any) => {
    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    
    try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const kanji = await db
            .collection("kanjis")
            .aggregate([
                { $match: { kanji: req.query.kanji } },
                {
                    $lookup: {
                        from: 'onyomigroups',
                        localField: 'onyomiGroups',
                        foreignField: '_id',
                        as: 'onyomiGroups'
                    }
                }, {
                    $lookup: {
                        from: 'kunyomigroups',
                        localField: 'kunyomiGroups',
                        foreignField: '_id',
                        as: 'kunyomiGroups'
                    }
                }, {
                    $lookup: {
                        from: 'lookalikegroups',
                        localField: 'lookalikeGroups',
                        foreignField: '_id',
                        as: 'lookalikeGroups'
                    }
                }
            ])
            .toArray();

        if (kanji.length > 0) {
            const mainKanjiDetails = kanji[0];

            const kunyomiReadingsSearch = await db
                .collection("kanjis")
                .find({ kun_readings: { $elemMatch: { $in: mainKanjiDetails.kun_readings } } })
                .toArray();
            const kunyomiGeneralSearch = kunyomiReadingsSearch.filter(kanji => kanji.kanji !== mainKanjiDetails.kanji);
            const kunyomiGeneralSearchMembers = kunyomiGeneralSearch.length > 0 ? kunyomiGeneralSearch.map(kanji => kanji.kanji) : [];

            const lookalikeGroupMembers = mainKanjiDetails.lookalikeGroups.map((group: any) => group.members);
            const onyomiGroupMembers = mainKanjiDetails.onyomiGroups.map((group: any) => group.members);
            const kunyomiGroupMembers = mainKanjiDetails.kunyomiGroups.map((group: any) => group.members)
                .filter((kanji: any) => kanji !== mainKanjiDetails.kanji);

            const associatedKanji = Array
                .from(new Set(lookalikeGroupMembers
                    .concat(onyomiGroupMembers, kunyomiGroupMembers, kunyomiGeneralSearchMembers).flat()))
                .filter(member => member !== req.query.kanji);
            const associatedKanjiWithKanjiDetails = kunyomiGeneralSearchMembers;
            const associatedKanjiWithoutKanjiDetails = associatedKanji
                .filter(kanji => !associatedKanjiWithKanjiDetails.includes(kanji));

            const availableKanjiDetails = kunyomiGeneralSearch;
            const missingKanjiDetails = await db
                .collection("kanjis")
                .find({
                    kanji: { $in: associatedKanjiWithoutKanjiDetails }
                })
                .toArray();
            const associatedKanjiDetails = availableKanjiDetails.concat(missingKanjiDetails);

            mainKanjiDetails.otherSameKunyomiKanji = kunyomiGeneralSearchMembers;
            mainKanjiDetails.associatedKanjiDetails = associatedKanjiDetails;

            res.json(mainKanjiDetails);
        } else {
            res.json('Kanji not found');
        }
    } catch (e) {
        console.error(e);
    }
}

export default fn;