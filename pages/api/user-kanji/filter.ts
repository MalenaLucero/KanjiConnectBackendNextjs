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
        const match: any = { user: req.body.user }

        if (req.body.hasOwnProperty('kanjiAsCharacter')) {
            const kanji = await db.collection('kanjis').findOne({ kanji: req.body.kanjiAsCharacter })
            match.kanji = kanji?._id;
        } else {
            if (req.body.hasOwnProperty('difficulty')) {
                match.difficulty = req.body.difficulty; 
            }
            if (req.body.hasOwnProperty('lesson')) {
                const expressions = await db.collection('expressions')
                    .find({ lesson: req.body.lesson }).toArray();
                match.expressions = { $in: expressions.map(e => e._id )}
            }
            if (req.body.hasOwnProperty('jlpt')) {
                const kanjis = await db.collection('kanjis')
                    .find({ jlpt: req.body.jlpt }).toArray();
                match.kanji = { $in: kanjis.map(e => e._id )}
            }
        }

        const userKanjis = await db
                .collection("userkanjis")
                .aggregate([
                    { $match: match },
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
        
        res.json(userKanjis.map(kanji => {
            return {...kanji, kanji: kanji.kanji[0]}
        }))
    } catch (e) {
        console.error(e);
    }
}