import clientPromise from "../../../../../lib/mongodb";

//$eq means EQUALS and is the same as { field: <value>} except when <value> is a regular expression

//returns data for expression 豪雨

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ word: { $eq: "豪雨"}})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}