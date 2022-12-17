import clientPromise from "../../lib/mongodb";

export default async (req: any, res: any) => {
   try {
       const client = await clientPromise;
       const db = client.db("kanji-connect");

       const movies = await db
           .collection("expressions")
           .find({})
           .sort({ metacritic: -1 })
           .limit(10)
           .toArray();

       res.json(movies);
   } catch (e) {
       console.error(e);
   }
};