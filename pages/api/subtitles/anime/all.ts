import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from 'mongodb';

export default async (req: any, res: any) => {

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");
        const anime = await db.collection('anime').find({}).toArray();
        res.json(anime);
    } catch (e) {
        console.error(e);
    }
}