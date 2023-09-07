import clientPromise from "../../../../../lib/mongodb";

//$size matches any ARRAY WITH THE NUMBER OF ELEMENTS specified

//returns documents with four tags

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("expressions")
            .find({ tags: { $size: 4 }})
            .toArray()

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}