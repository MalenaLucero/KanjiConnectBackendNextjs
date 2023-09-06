import clientPromise from "../../../../../lib/mongodb";

//$lte selects the documents where the value of the field is LESS OR EQUAL TO a specified value

//returns all jlpt 1 and 2 expressions

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ jlpt: { $lte: 2 }})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}