import fs from "fs";
import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/user.ts";
import Entry from "../models/entry.ts";
import EntryData from "./entry-data.json" with { type: "json" };
import SleepData from "../models/sleepData.ts";
// var jsonData = '{"persons":[{"name":"John","city":"New York"},{"name":"Phil","city":"Ohio"}]}';'

console.log(process.env.MONGODB_USERNAME, "this is the process.env");
const connect = async () =>
  await mongoose
    .connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@portfolio-website.halgu.mongodb.net/zealthy`,
    )
    .then((res) => {
      console.log("db connected ");
    })
    .catch((err) => {
      console.log(err);
      console.log("Cannot connect to database");
    });
await connect();

const close = async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

let documentsArray: any[] = [];
const users = ["alice", "bob", "ming"];
const createManyDocuments = async () => {
  await User.deleteMany();
  await Entry.deleteMany();
  await SleepData.deleteMany();
  let newUsers: InstanceType<typeof User>[] = [];
  let newEntries: InstanceType<typeof Entry>[] = [];

  const resultArray = users.map((ele: string, key: number) => {
    // console.log(categories[Math.floor(Math.random() * categories.length)].name)
    //   const newPostId = new mongoose.Types.ObjectId()

    const newUser: InstanceType<typeof User> = new User({
      _id: new mongoose.Types.ObjectId(),
      username: ele,
      email: `${ele}@email.net`,
      created_at: new Date(),
      password: "password",
      // _id: newPostId
    });

    const newEntry: InstanceType<typeof Entry> = new Entry({
      user_id: newUser._id,
      entries: EntryData,
    });

    newUser.entry_id = newEntry._id;
    console.log("this is the new user", newUser);

    newUsers.push(newUser);
    newEntries.push(newEntry);
    return newUser;
  });

  console.log(resultArray);
  documentsArray = resultArray;
  await Entry.insertMany(newEntries);
  await User.insertMany(newUsers);
};

await createManyDocuments();

// parse json
var jsonObj = JSON.parse(`{"sample_data" :${JSON.stringify(documentsArray)}}`);
console.log(jsonObj);

// stringify JSON Object
var jsonContent = JSON.stringify(documentsArray);
console.log(jsonContent);

fs.writeFile("./sample-data.json", jsonContent, "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }

  console.log("JSON file has been saved.");
});

close();
