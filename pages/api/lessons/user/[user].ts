import clientPromise from "../../../../lib/mongodb";

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("lessons")
            .find({ user: req.query.user })
            .sort({ date: "ascending" })
            .toArray();

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}