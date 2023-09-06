import clientPromise from "../../../../../lib/mongodb";

//$ne selects the documents where
//1- the field value is NOT IN THE SPECIFIED ARRAY
//2- the field DOES NOT EXIST
//{ field: $nin: { [<value1>, <value2>...]}}

//returns expressions with jlpt 1 and null

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ jlpt: { $nin: [4, 3, 2]}})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}