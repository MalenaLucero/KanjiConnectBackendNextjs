import clientPromise from "../../../../lib/mongodb";

interface Anime {
    japaneseTitle: string,
    englishTitle: string
}

export default async (req: any, res: any) => {

   try {
        // const client = await clientPromise;
        // const db = client.db("kanji-connect");
        // const anime: Anime = {
        //     japaneseTitle: `Kuroko's Basketball`,
        //     englishTitle: '黒子のバスケ'
        // } 
        // const animeCreated = await db.collection('anime').insertOne(anime);
        // res.json(animeCreated);
    } catch (e) {
        console.error(e);
    }
}