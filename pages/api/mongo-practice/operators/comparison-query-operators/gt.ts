import clientPromise from "../../../../../lib/mongodb";

//$gt selects the documents that are GREATER THAN a certain value

//returns expressions with jlpt 4 and 5

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ jlpt: { $gt: 3 }})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}