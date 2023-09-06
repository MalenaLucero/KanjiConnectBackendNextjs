import clientPromise from "../../../../../lib/mongodb";

//$gte selects the documents that are GREATER OR EQUAL to a certain value

//returns expressions with jlpt 4 and 5

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ jlpt: { $gte: 4 }})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}