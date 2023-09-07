import clientPromise from "../../../../../lib/mongodb";

//$and performs a logical AND operation
//can be used for queries specifying the same field
//{ $and: [<expression1>, <expression2>...]}

//returns expressions with jlpt 1 and difficult >= 6

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ 
                $and: [
                    { difficulty: { $gte: 6 }},
                    { jlpt: 1 }
                ]
            })
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}