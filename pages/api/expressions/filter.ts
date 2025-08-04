import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

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
        const { body } = req;
        const match: any = { user: body.user }

        if (body.hasOwnProperty('searchList')) {
            match.word = { $in: body.searchList }
        } else {
            if (body.hasOwnProperty('reading')) {
                match.reading = body.reading;
            }
            if (body.hasOwnProperty('transitivity')) {
                match.transitivity = body.transitivity;
            }
            if (body.hasOwnProperty('jlpt')) {
                match.jlpt = body.jlpt;
            }
            if (body.hasOwnProperty('difficulty')) {
                match.difficulty = { $in: body.difficulty };
            }
            if (body.hasOwnProperty('lesson') && body.lesson !== null && body.lesson.length !== 0) {
                match.lesson = body.lesson;
            }
            if (body.hasOwnProperty('tags') && body.tags.length !== 0) {
                match.tags = { $all: body.tags.map((id: string) => new ObjectId(id)) };
            }
            if (body.hasOwnProperty('source')) {
                match.exampleSentences = { $elemMatch: { source: body.source }};
            }
        }
        
        const expressions = await db
                .collection("expressions")
                .aggregate([
                    { $match: match }, 
                    { $lookup: {
                        from: 'tags',
                        localField: 'tags',
                        foreignField: '_id',
                        as: 'populatedTags' 
                    }},
                    { $lookup: {
                        from: 'kanjis',
                        localField: 'kanjis',
                        foreignField: '_id',
                        as: 'populatedKanjis' 
                    }},
                    { $sort : { difficulty : -1 } }
                ])
                .toArray()
        
        const lessonSources = await db
                .collection("lessonsources")
                .find({ user: body.user })
                .toArray();
        
        const expressionsWithSources = expressions.map(expression => {
            if (expression.exampleSentences.length > 0) {
                const lessonSource = lessonSources.find(lessonSource => lessonSource.source.toString() === expression.exampleSentences[0].source.toString())
                expression.exampleSentences[0].source = lessonSource?.name;
                return expression;
            }
            return expression;
        }) 
        
        res.json(expressionsWithSources)
    } catch (e) {
        console.error(e);
    }
}