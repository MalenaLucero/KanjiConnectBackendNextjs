import clientPromise from "../../../../../lib/mongodb";

const fn = async (req: any, res: any) => {
    // try {
    //     const client = await clientPromise;
    //     const db = client.db("kanji-connect");

    //     const kanjis = await db
    //         .collection("kanjis")
    //         .updateMany({}, { $rename: { 'onyomigroups': 'onyomiGroups', 'kunyomigroups': 'kunyomiGroups', 'lookalikegroups': 'lookalikeGroups', } })

    //     res.json(kanjis);
    // } catch (e) {
    //     console.error(e);
    // }
}

export default fn;