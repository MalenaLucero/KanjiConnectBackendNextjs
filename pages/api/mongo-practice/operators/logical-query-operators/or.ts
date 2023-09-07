import clientPromise from "../../../../../lib/mongodb";

//$or performs a OR operation on an ARRAY of expressions

//returns expressions with jlpt 4 or difficulty 7

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ $or: [{ jlpt: 4 }, { difficulty: 7 }]})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}