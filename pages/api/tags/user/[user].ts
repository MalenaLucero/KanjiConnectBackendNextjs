import clientPromise from "../../../../lib/mongodb";
import NextCors from 'nextjs-cors';

export default async (req: any, res: any) => {
   await NextCors(req, res, {
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });

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