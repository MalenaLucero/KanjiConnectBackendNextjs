import clientPromise from "../../../../../lib/mongodb";

//insertOne
//if the collection doesn't exist, it creates it
//an _id is added by mongo as ObjectId()

//return {"acknowledged":true,"insertedId":"65035a4f9e5571ec309b2efa"}

const fn = async (req: any, res: any) => {
   try {
        // const client = await clientPromise;
        // const db = client.db("kanji-connect");

        // const lessons = await db
        //     .collection("test")
        //     .insertOne({name: "Satoru", lastname: "Gojo"})

        // res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}

export default fn;