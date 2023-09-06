import clientPromise from "../../../../../lib/mongodb";

//$ne selects the documents where the value of the field is NOT EQUAL to the specified value
//It includes documents that do not contain the field

//returns expressions with difficulty different to 5

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ difficulty: { $ne: 5 }})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}