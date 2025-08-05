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
        const words = req.query.words.split(',');
        const anime = await db.collection("anime").find({}).toArray();

        const allResults = [];
   
        for(let word of words) {
            const match: any = {
                "subtitles.line": { $regex: word }
            }
            const filter = await db.collection('episodes').find(match).toArray();
 
            let numberOfInstances = 0;
            const filteredEpisodes = filter.map(episode => {
                const filteredSubtitles = episode.subtitles.filter((subtitle: any) => subtitle.line.includes(word));
                numberOfInstances += filteredSubtitles.length;
                return { ...episode, subtitles: filteredSubtitles }
            });

            if (filteredEpisodes.length > 0) {
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
        }

        if (allResults.length > 0) {
            res.json(allResults);
        } else {
            res.json('Word or words not found');
        }
    } catch (e) {
        console.error(e);
    }
}