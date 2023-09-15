import clientPromise from "../../../../../lib/mongodb";

//insertMany

//returns {"acknowledged":true,"insertedCount":2,"insertedIds":{"0":"65035a9c9e5571ec309b2efb","1":"65035a9c9e5571ec309b2efc"}}

const fn = async (req: any, res: any) => {
   try {
        // const client = await clientPromise;
        // const db = client.db("kanji-connect");

        // const lessons = await db
        //     .collection("test")
        //     .insertMany([{name: "Satoru", lastname: "Gojo"},{name: "Megumi", lastname: "Fushiguro"}])

        // res.json(lessons);
    } catch (e) {
        console.error(e);
    }
}

export default fn;