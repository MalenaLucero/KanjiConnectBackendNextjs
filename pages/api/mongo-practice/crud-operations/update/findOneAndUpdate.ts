import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb";

//findOneAndUpdate updates a single document based on the filter and sort criteria
//updates the first matching document in the collection
//The sort parameter can be used to influence which document is updated
//findOneAndUpdate( filter, update, options )

//returns { "updatedExisting": true } and the original document 

const fn = async (req: any, res: any) => {
   try {
        const client = await clientPromise;
        const db = client.db("kanji-connect");

        const lessons = await db
            .collection("test")
            .findOneAndUpdate({_id: new ObjectId("65035a9c9e5571ec309b2efb")}, [{$set: {name: "edited"}}])

        res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}

export default fn;