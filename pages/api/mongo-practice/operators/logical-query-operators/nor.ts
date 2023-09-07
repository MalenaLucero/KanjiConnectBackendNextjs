import clientPromise from "../../../../../lib/mongodb";

//$nor performs a logical NOT operation on an ARRAY. Returns all the documents that fail all the query expressions
//{ $nor: [<expression1>, <expression2>...]}

//returns expressions that don't have jlpt 1 or difficulty 5

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({  $nor: [{ jlpt: 1 }, { difficulty: 5 }]})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}