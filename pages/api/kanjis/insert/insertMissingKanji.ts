import clientPromise from "../../../../lib/mongodb";

const findAndUpdate = async (member: any) => {
    const client = await clientPromise;
    const db = client.db("kanji-connect");
    const kanji = await db
        .collection('kanjis')
        .findOne({ kanji: member })

    if (kanji === null) {
        const URI = 'https://kanjiapi.dev/v1/kanji/' + member;
        const response = await fetch(URI)
        const externalKanji = await response.json();

        const kanjiToCreate: any = {
            on_readings: externalKanji.on_readings,
            kun_readings: externalKanji.kun_readings,
            meanings: externalKanji.meanings,
            kanji: externalKanji.kanji,
            grade: externalKanji.grade,
            jlpt: externalKanji.jlpt,
            kunyomiGroups: null,
            lookalikeGroups: null,
            onyomiGroups: null
        }

        const kunyomiGroups = await db
            .collection("kunyomigroups")
            .find({ members: member })
            .toArray()

        if (kunyomiGroups.length > 0) {
            kanjiToCreate.kunyomiGroups = kunyomiGroups.map(group => group._id)
        }

        const onyomiGroups = await db
            .collection("onyomigroups")
            .find({ members: member })
            .toArray()
        if (onyomiGroups.length > 0) {
            kanjiToCreate.onyomiGroups = onyomiGroups.map(group => group._id)
        }

        const lookalikeGroups = await db
            .collection("lookalikegroups")
            .find({ members: member })
            .toArray()
        if (lookalikeGroups.length > 0) {
            kanjiToCreate.lookalikeGroups = lookalikeGroups.map(group => group._id)
        }

        const kanjiCreated = await db
            .collection("kanjis")
            .insertOne(kanjiToCreate)

    }
}

const fn = async (req: any, res: any) => {
    // try {
    //     const client = await clientPromise;
    //     const db = client.db("kanji-connect");

    //     const groups = await db
    //         .collection("onyomigroups")
    //         .find()
    //         .toArray()

    //     const allMembers = Array.from(new Set(groups.map(group => group.members).flat()))

    //     Promise.all(allMembers.map((member: any) => findAndUpdate(member)));

    //     res.json('done');
    // } catch (e) {
    //     console.error(e);
    // }
}

export default fn;