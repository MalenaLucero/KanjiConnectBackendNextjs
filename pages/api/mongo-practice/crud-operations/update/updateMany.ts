import clientPromise from "../../../../../lib/mongodb";

//updateMany updates many documents
//the first parameter is the filter, an empty object means update all documents in the collection
//the second parameter is the field to update
//in the case the field note with an empty array was added to all documents in expressions and user-kanji

//return value:
// {
//     "acknowledged": true,
//     "modifiedCount": 1201,
//     "upsertedId": null,
//     "upsertedCount": 0,
//     "matchedCount": 1201
// }

const fn = async (req: any, res: any) => {
//    try {
//         const client = await clientPromise;
//         const db = client.db("kanji-connect");

//         const expressions = await db
//             .collection("expressions")
//             .updateMany({}, {$set: {notes:""}})

//         res.json(expressions);
//     } catch (e) {
//         console.error(e);
//     }
}

export default fn;