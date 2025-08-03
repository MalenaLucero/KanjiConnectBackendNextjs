import clientPromise from "../../../../lib/mongodb";
import NextCors from 'nextjs-cors';
import { ObjectId } from "mongodb";

export default async (req: any, res: any) => {
   await NextCors(req, res, {
      methods: ['POST'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const { body } = req;
        const match: any = {};

        if (body?.animeIds) {
            match.anime = { $in: body.animeIds.map((id: string) => new ObjectId(id))}
        }

        const projection = {
            projection: { englishTitle: 1, number: 1, season: 1, anime: 1 }
        };

        const filter = await db.collection('episodes').find(match, projection).toArray();
        res.json(filter);
    } catch (e) {
        console.error(e);
    }
}