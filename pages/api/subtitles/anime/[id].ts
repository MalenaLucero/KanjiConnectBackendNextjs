import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from 'mongodb';

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
        const animeId = req.query.id;
        const anime = await db.collection('anime').findOne({_id: new ObjectId(animeId)})
        res.json(anime);
    } catch (e) {
        console.error(e);
    }
}