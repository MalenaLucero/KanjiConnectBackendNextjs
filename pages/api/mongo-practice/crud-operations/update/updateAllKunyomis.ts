import clientPromise from "../../../../../lib/mongodb";

const updateKanji = async (kanji: any) => {
    console.log(kanji)
    const client = await clientPromise;
    const db = client.db("kanji-connect");

    const onyomigroup = await db
        .collection("kunyomigroups")
        .find({ members: kanji.kanji })
        .toArray()

    if (onyomigroup.length > 0) {
        const updatedKanji = await db
            .collection("kanjis")
            .updateOne({ _id: kanji._id }, [{ $set: { kunyomiGroups: onyomigroup.map(e => e._id) } }])
    } 
}

const fn = async (req: any, res: any) => {
    // try {
    //     const client = await clientPromise;
    //     const db = client.db("kanji-connect");

    //     const kanjis = await db
    //         .collection("kanjis")
    //         .find()
    //         .toArray()

    //     Promise.all(kanjis.map(kanji => updateKanji(kanji)))

    //     res.json('done');
    // } catch (e) {
    //     console.error(e);
    // }
}

export default fn;