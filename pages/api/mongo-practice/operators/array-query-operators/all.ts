import clientPromise from "../../../../../lib/mongodb";

//$all selects the documents where the field value contains ALL THE ARRAY ELEMENTS
// { field: { $all: [<value1>, <value2>...]}}

//returns all documents with the specified meaning

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ englishMeaning: { $all: ["headlong rush, rushing recklessly"]}})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}