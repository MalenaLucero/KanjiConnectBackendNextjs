// import clientPromise from "../../../../lib/mongodb";
// import NextCors from 'nextjs-cors';
// import fs from 'fs';
// import path from 'path';
// import { ObjectId } from "mongodb";

// const TIMING_SEPARATION = '-->';

// interface Sub {
//     startTime: string;
//     endTime: string;
//     line: string;
// }

// interface Episode {
//     japaneseTitle: string | null;
//     englishTitle: string | null;
//     anime: ObjectId;
//     number: number;
//     season: number;
//     summary: string | null;
//     subtitles: Sub[];
// }

// const isLineTiming = (line: string) => {
//     return line.includes(TIMING_SEPARATION) && line.includes(':')
// }

// const pushToSubsAndClean = (subs: Sub[], sub: Sub ) => {
//     const subCopy = {...sub};
//     subs.push(subCopy);
//     return {
//         startTime: '',
//         endTime: '',
//         line: ''
//     }
// }

// const setStartTimeAndEndTime = (sub: Sub, line: string) => {
//     const times = line.split(TIMING_SEPARATION);
//     sub.startTime = times[0].trim();
//     sub.endTime = times[1].trim();
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
//         const folderPath = './public/subs'; // Change this to your folder path

//         fs.readdir(folderPath, async (err, files) => {
//             for (let file of files) {
//                 const filePath = path.join(folderPath, file);
//                 const number = parseInt(file.split('.')[1].split('S03E')[1]);
//                 const title = null;
//                 const content = fs.readFileSync(filePath, 'utf-8');
//                 const lines = content.split('\n').map(line => line.trim());
//                 const subs: Sub[] = [];
//                 let sub = {
//                     startTime: '',
//                     endTime: '',
//                     line: ''
//                 }
//                 lines.forEach(line => {
//                     if (isLineTiming(line)) {
//                         if (sub.startTime) {
//                             sub = pushToSubsAndClean(subs, sub)
//                         }
//                         setStartTimeAndEndTime(sub, line);
//                     } else {
//                         if (sub.line) {
//                             sub.line = sub.line + ' ' + line;
//                         } else {
//                             sub.line = line;
//                         }
//                     }
//                 });
//                 subs.push(sub);
//                 const episode: Episode = {
//                     japaneseTitle: null,
//                     englishTitle: title,
//                     anime: new ObjectId('688f666b046feb316f849ce0'),
//                     number,
//                     season: 3,
//                     summary: null,
//                     subtitles: subs
//                 } 
//                 console.log(episode.number)
//                 console.log(episode.englishTitle)
//                 console.log(episode.subtitles[0])
//                 const episodeCreated = await db.collection('episodes').insertOne(episode);
//             }
//         });
//         res.json('ok');
//     } catch (e) {
//         console.error(e);
//     }
// }
