import clientPromise from "../../../lib/mongodb";
import NextCors from 'nextjs-cors';
import { ObjectId } from "mongodb";

interface Query {
    user: string,
    kanji?: ObjectId,
    difficulty?: number,
    jlpt?: number,
}

export default async (req: any, res: any) => {
   await NextCors(req, res, {
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const kanji = await db.collection('kanjis').findOne({ kanji: req.body.kanjiAsCharacter })

        const userKanjis = await db
                .collection("userkanjis")
                .aggregate([
                    { $match: { kanji: kanji?._id }},
                    { $lookup: {
                        from: 'kanjis',
                        localField: 'kanji',
                        foreignField: '_id',
                        as: 'kanji' 
                    }}, 
                    { $lookup: {
                        from: 'expressions',
                        localField: 'expressions',
                        foreignField: '_id',
                        as: 'expressions'
                    }}
                ])
                .toArray()
        
        res.json(userKanjis)
    } catch (e) {
        console.error(e);
    }
}