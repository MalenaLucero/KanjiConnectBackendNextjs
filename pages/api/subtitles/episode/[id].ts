import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from 'mongodb';

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");
        const episodeId = req.query.id;
        const episode = await db.collection('episodes').findOne({_id: new ObjectId(episodeId)})
        res.json(episode);
    } catch (e) {
        console.error(e);
    }
}