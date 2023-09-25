import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb";

//updateOne uses an aggregation pipeline to update the document with the specified id

//return {"acknowledged":true,"insertedId":"65035a4f9e5571ec309b2efa"}

const fn = async (req: any, res: any) => {
   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("test")
            .updateOne({_id: new ObjectId("65035a4f9e5571ec309b2efa")}, [{$set: {lastname: "Gojou"}}])

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}

export default fn;