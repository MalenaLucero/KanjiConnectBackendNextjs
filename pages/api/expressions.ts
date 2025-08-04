import clientPromise from "../../lib/mongodb";

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

       const expressions = await db
           .collection("expressions")
           .find({})
           .sort({ metacritic: -1 })
           .limit(10)
           .toArray();

       res.json(expressions);
   } catch (e) {
       console.error(e);
   }
};