import clientPromise from "../../lib/mongodb";

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const tags = await db
            .collection("tags")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();

        res.json(tags);
    } catch (e) {
        console.error(e);
    }
}