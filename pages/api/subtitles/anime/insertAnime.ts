// import clientPromise from "../../../../lib/mongodb";
// import NextCors from 'nextjs-cors';

// interface Anime {
//     japaneseTitle: string,
//     englishTitle: string
// }

// export default async (req: any, res: any) => {
//    await NextCors(req, res, {
//       methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//       origin: '*',
//       optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//    });

//    try {
//         const client = await clientPromise;
//         const db = client.db("kanji-connect");
//         const anime: Anime = {
//             japaneseTitle: `Kuroko's Basketball`,
//             englishTitle: '黒子のバスケ'
//         } 
//         const animeCreated = await db.collection('anime').insertOne(anime);
//         res.json(animeCreated);
//     } catch (e) {
//         console.error(e);
//     }
// }