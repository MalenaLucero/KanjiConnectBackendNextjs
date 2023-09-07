import clientPromise from "../../../../../lib/mongodb";

//$elemMatch matches documents that contain an ARRAY FIELD with AT LEAST ONE ELEMENT that matches the criteria
// { field: { $elemMatch: [<query1>, <query2>...]}}

//returns all documents with the specified meaning

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ englishMeaning: { $elemMatch: { $in: ["headlong rush, rushing recklessly"]}}})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}