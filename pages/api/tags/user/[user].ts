import clientPromise from "../../../../lib/mongodb";

export default async (req: any, res: any) => {
    try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const tags = await db
            .collection("tags")
            .find({ user: req.query.user })
            .sort({ metacritic: -1 })
            .toArray();

        res.json(tags);
    } catch (e) {
        console.error(e);
    }
};