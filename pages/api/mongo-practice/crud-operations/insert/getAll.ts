import clientPromise from "../../../../../lib/mongodb";

const fn = async (req: any, res: any) => {
   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("test")
            .find()
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}

export default fn;