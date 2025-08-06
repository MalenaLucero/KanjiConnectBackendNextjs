import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import { useSearchParams } from 'next/navigation';

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

        const anime = req.query.anime;
        const season = req.query.season;
        const number = req.query.number;
        
        const match: any = {
            anime: new ObjectId(anime),
            season: parseInt(season),
            number: parseInt(number)
        };

        const filter = await db.collection('episodes').findOne(match);
        res.json(filter);
    } catch (e) {
        console.error(e);
    }
}