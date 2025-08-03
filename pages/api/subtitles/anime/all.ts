import NextCors from 'nextjs-cors';
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from 'mongodb';

export default async (req: any, res: any) => {
   await NextCors(req, res, {
      methods: ['GET'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");
        const anime = await db.collection('anime').find({}).toArray();
        res.json(anime);
    } catch (e) {
        console.error(e);
    }
}