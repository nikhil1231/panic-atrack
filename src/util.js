import * as Realm from "realm-web";

const APP_ID = process.env.REACT_APP_MONGO_REALM_APP_ID;
const DATA_SOURCE_NAME = "mongodb-atlas";
const DATABASE_NAME = "main";
const COLLECTION_NAME = "episodes";
const app = new Realm.App({ id: APP_ID });

export const insertEpisode = async (episode) => {
  const collection = await getCollection();

  await collection.insertOne(episode);
};

export const getEpisodes = async () => {
  const collection = await getCollection();

  const eps = await collection.find();

  eps.sort((a, b) => new Date(a.time) - new Date(b.time));

  return eps;
};

export const deleteEpisode = async (_id) => {
  const collection = await getCollection();

  await collection.deleteOne({ _id });
};

export const formatDate = (isoString) => {
  const dateObj = new Date(isoString);
  const date = dateObj.toLocaleDateString("en-uk", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Format: HH:MM AM/PM
  return `${date} ${time}`;
};

const getCollection = async () => {
  // Authenticate with Realm (using anonymous authentication for this example)
  const user = await app.logIn(Realm.Credentials.anonymous());

  // Connect to MongoDB
  const mongo = app.currentUser.mongoClient(DATA_SOURCE_NAME);
  return mongo.db(DATABASE_NAME).collection(COLLECTION_NAME);
};
