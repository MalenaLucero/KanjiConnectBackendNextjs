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
        const { body } = req;
        const match: any = { user: body.user }

        if (body.hasOwnProperty('searchList')) {
            const kanji = await db.collection('kanjis')
                .find({ kanji: { $in: body.searchList }}).toArray()
            match.kanji = { $in: kanji.map(e => e._id) }
        } else {
            if (body.hasOwnProperty('difficulty')) {
                match.difficulty = body.difficulty; 
            }
            if (body.hasOwnProperty('lesson')) {
                const expressions = await db.collection('expressions')
                    .find({ lesson: body.lesson }).toArray();
                match.expressions = { $in: expressions.map(e => e._id )}
            }
            if (body.hasOwnProperty('jlpt') && body.jlpt > 0) {
                const kanjis = await db.collection('kanjis')
                    .find({ jlpt: body.jlpt }).toArray();
                match.kanji = { $in: kanjis.map(e => e._id )}
            }
            if (body.hasOwnProperty('tags') && body.tags.length !== 0) {
                const expressions = await db.collection('expressions')
                    .find({ tags: {$all: body.tags.map((id: string) => new ObjectId(id)) }}).toArray();
                match.expressions = { $in: expressions.map(e => e._id )}
            }
            if (body.hasOwnProperty('source')) {
                const expressions = await db.collection('expressions')
                    .find({ exampleSentences: { $elemMatch: { source: body.source }}}).toArray();
                match.expressions = { $in: expressions.map(e => e._id )}
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