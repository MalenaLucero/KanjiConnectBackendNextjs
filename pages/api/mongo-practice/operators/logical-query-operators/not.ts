import clientPromise from "../../../../../lib/mongodb";

//$not performs a logical NOT operation
//selects the elements that don't match the value and the documents that don't contain the field

//returns expressions with difficulty not less than 6, so >= 6

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ difficulty: { $not: { $lt: 6 } }})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}