import clientPromise from "../../../lib/mongodb";
import NextCors from 'nextjs-cors';
import { ObjectId, WithId } from "mongodb";
import { Expression } from "typescript";

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
        let isSearchList = false;

        if (body.hasOwnProperty('searchList')) {
            isSearchList = true;
            const kanji = await db.collection('kanjis')
                .find({ kanji: { $in: body.searchList }}).toArray()
            match.kanji = { $in: kanji.map(e => e._id) }
        } else {
            isSearchList = false;
            if (body.hasOwnProperty('difficulty')) {
                match.difficulty = { $in: body.difficulty }; 
            }
            if (body.hasOwnProperty('jlpt') && body.jlpt > 0) {
                const kanjis = await db.collection('kanjis')
                    .find({ jlpt: body.jlpt }).toArray();
                match.kanji = { $in: kanjis.map(e => e._id )}
            }
            if (body.hasOwnProperty('lesson') || body.hasOwnProperty('tags') || body.hasOwnProperty('source')) {
                const findObject: any = {}
                if (body.hasOwnProperty('lesson')) {
                    findObject.lesson = body.lesson;
                }
                if (body.hasOwnProperty('tags') && body.tags.length !== 0) {
                    findObject.tags = { $all: body.tags.map((id: string) => new ObjectId(id)) }
                }
                if (body.hasOwnProperty('source')) {
                    findObject.exampleSentences = { $elemMatch: { source: body.source }}
                }
                const expressions = await db.collection('expressions').find(findObject).toArray();
                match.expressions = { $in: expressions.map((e: { _id: any; }) => e._id )}
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
                    }},
                    { $sort : { difficulty : -1 } }
                ])
                .toArray()

        const lessonSources = await db
            .collection("lessonsources")
            .find({ user: body.user })
            .toArray();
        
        const populatedUserKanji: any = userKanjis.map(kanji => {
            const expressions = kanji.expressions.map((expression: any) => {
                if (expression.exampleSentences.length > 0) {
                    const lessonSource = lessonSources.find(lessonSource => lessonSource.source.toString() === expression.exampleSentences[0].source.toString())
                    expression.exampleSentences[0].source = lessonSource?.name;
                    return expression;
                } else {
                    return expression;
                }
            })
            return {...kanji, kanji: kanji.kanji[0], expressions: expressions}
        })

        if (isSearchList) {
            const userKanji = populatedUserKanji.map((populatedKanji: any) => populatedKanji.kanji.kanji);
            const missingKanji = body.searchList.filter((kanji: string) => !userKanji.includes(kanji));
            if (missingKanji.length > 0) {
                const kanji = await db.collection('kanjis')
                    .find({ kanji: { $in: missingKanji }})
                    .toArray()
                const format = kanji.map(kanji => {
                    return {
                        kanji: kanji
                    }
                })
                const mergedKanjis = populatedUserKanji.concat(format);
                res.json(mergedKanjis);
            } else {
                res.json(populatedUserKanji);
            }
        } else {
            res.json(populatedUserKanji);
        }
    } catch (e) {
        console.error(e);
    }
}