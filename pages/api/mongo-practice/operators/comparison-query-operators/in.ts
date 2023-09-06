import clientPromise from "../../../../../lib/mongodb";

//$in selects the documents where the value of a field EQUALS ANY VALUE IN A SPECIFIED ARRAY
//{ field: { $in: [<value1>, <value2>...]}}

//returns expressions with tag id '61605ed19e01832a809af752'
//the tags property is an array of ids
//$in checks if the expression has the specified id

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ tags: { $in: ['61605ed19e01832a809af752'] }})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}