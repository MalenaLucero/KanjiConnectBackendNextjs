import clientPromise from "../../../lib/mongodb";

const fn = async (req: any, res: any) => {
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
            const lookalikeGroupMembers = kanji[0].lookalikeGroups.map((group: any) => group.members);
            const onyomiGroupMembers = kanji[0].onyomiGroups.map((group: any) => group.members);
            const kunyomiGroupMembers = kanji[0].kunyomiGroups.map((group: any) => group.members);
            const associatedKanji = Array.from(new Set(lookalikeGroupMembers.concat(onyomiGroupMembers, kunyomiGroupMembers).flat()))
                .filter(member => member !== req.query.kanji);

            const associatedKanjiDetails = await db
                .collection("kanjis")
                .find({
                    kanji: { $in: associatedKanji }
                })
                .toArray()

            kanji[0].associatedKanjiDetails = associatedKanjiDetails
            res.json(kanji[0]);
        } else {
            res.json('Kanji not found');
        }
    } catch (e) {
        console.error(e);
    }
}

export default fn;