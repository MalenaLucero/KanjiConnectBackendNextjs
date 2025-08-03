import clientPromise from "../../../../lib/mongodb";
import NextCors from 'nextjs-cors';
import { ObjectId } from "mongodb";

export default async (req: any, res: any) => {
   await NextCors(req, res, {
      methods: ['POST'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });

   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const { body } = req;
        const words = body.words;
        const animeIds = body?.animeIds;

        const allResults = [];
   
        for(let word of words) {
            const match: any = {
                "subtitles.line": { $regex: word }
            }
            if (animeIds) {
                match.anime = { $in: animeIds.map((id: string) => new ObjectId(id))}
            }
            const filter = await db.collection('episodes').find(match).toArray();
 
            let numberOfInstances = 0;
            const filteredEpisodes = filter.map(episode => {
                const filteredSubtitles = episode.subtitles.filter((subtitle: any) => subtitle.line.includes(word));
                numberOfInstances += filteredSubtitles.length;
                return { ...episode, subtitles: filteredSubtitles }
            });

            let anime;
            if (animeIds) {
                anime = await db.collection("anime").find({_id: {$in: animeIds.map((id: string) => new ObjectId(id))}}).toArray();
            } else {
                anime = await db.collection("anime").find({}).toArray();
            }

            const result = {
                word,
                numberOfInstances,
                numberOfEpisodes: filter.length,
                episodesGroupedByAnime: anime.map(a => {
                    return {
                        anime: a.englishTitle,
                        episodes: filteredEpisodes.filter((episode: any) => episode.anime.toString() === a._id.toString())
                    }
                }).filter((anime: any) => anime.episodes.length > 0)
            };

            allResults.push(result);
        }

        res.json(allResults);
    } catch (e) {
        console.error(e);
    }
}