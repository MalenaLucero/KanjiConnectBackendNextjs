import clientPromise from "../../../../lib/mongodb";

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

       type KanjiMasterEntry = {
        level: "N2" | "N1" | "N3" | "N4" | "N5";
        page: number;
        };

        type KanjiDoc = {
        kanji: string;
        kanjiMaster?: KanjiMasterEntry[];
        };

    //     const kanjis = db.collection<KanjiDoc>("kanjis");

    //    const result = await kanjis.updateMany(
    //         { kanji: { $in: ["扉", "棚", "卓", "斎", "堀", "炉", "芳", "臭"] } },
    //         {
    //             $push: {
    //                 "kanjiMaster": { level: "N1", page: 38 }
    //             }
    //         }
    //     )

    //    res.json(result);
   } catch (e) {
       console.error(e);
   }
};