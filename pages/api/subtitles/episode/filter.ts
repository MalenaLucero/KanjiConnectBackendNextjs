import clientPromise from "../../../../lib/mongodb";
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
        const match: any = {};

        if (body?.animeIds) {
            match.anime = { $in: body.animeIds.map((id: string) => new ObjectId(id))}
        }

        const projection = {
            projection: { englishTitle: 1, number: 1, season: 1, anime: 1 }
        };

        const filter = await db.collection('episodes').find(match, projection).toArray();
        res.json(filter);
    } catch (e) {
        console.error(e);
    }
}