import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req: any, res: any) => {

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