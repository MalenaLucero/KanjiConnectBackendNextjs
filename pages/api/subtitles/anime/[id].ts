import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from 'mongodb';

export default async (req: any, res: any) => {

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