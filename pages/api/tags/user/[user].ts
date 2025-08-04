import clientPromise from "../../../../lib/mongodb";

export default async (req: any, res: any) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*') // adjust in prod
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization'
    )

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
}