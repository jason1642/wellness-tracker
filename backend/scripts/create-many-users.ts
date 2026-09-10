import fs from 'fs'
import mongoose from 'mongoose'
import 'dotenv/config';
import User from '../models/user.ts';
import Tracker from '../models/tracker.ts';
// var jsonData = '{"persons":[{"name":"John","city":"New York"},{"name":"Phil","city":"Ohio"}]}';'

console.log(process.env.MONGODB_USERNAME, "this is the process.env")
const connect = async () => await mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@portfolio-website.halgu.mongodb.net/zealthy`
  
).then(res=>{console.log('db connected ')}).catch(err=>{ 
  console.log(err)
  console.log('Cannot connect to database')
}) 
await connect()

const close = async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

let documentsArray: any[] = []

const createManyDocuments = async () => {
  const users = ['john', 'karethel', 'lorinda','alice','walter', 'phillip','ryan', 'greg','bob', 'mary', 'ted', 'chris', 'ming', 'jacob']
  await User.deleteMany()
  let newUsers: InstanceType<typeof User>[] = []
  let newTrackers: InstanceType<typeof Tracker>[] = []

  const resultArray =  users.map((ele:string, key:number ) => {
    // console.log(categories[Math.floor(Math.random() * categories.length)].name)
//   const newPostId = new mongoose.Types.ObjectId()
    // create new tracker and assign the new user id as a reference for the tracker
    // so create user first then add user id after
    const newUser: InstanceType<typeof User> = new User({
        _id: new mongoose.Types.ObjectId(),
        username: ele,
        email: `${ele}@email.net`,
        created_at: new Date(),
        password: "password",
        // _id: newPostId
    })

    
    const newTracker: InstanceType<typeof Tracker> = new Tracker({
      user_id: newUser._id,
      // sleep_data: [],
      // water_data: [],
      // calories_data: [],
      // steps_data: []
    })

    newUser.tracker_id = newTracker._id
    console.log('this is the new user', newUser)
     newUsers.push(newUser)
     newTrackers.push(newTracker)
    return newUser
})

console.log(resultArray)
documentsArray = resultArray;

await User.insertMany(newUsers)
await Tracker.insertMany(newTrackers)
}



await createManyDocuments()



// parse json
var jsonObj = JSON.parse(`{"sample_data" :${JSON.stringify(documentsArray)}}`);
console.log(jsonObj);
 
// stringify JSON Object
var jsonContent = JSON.stringify(documentsArray);
console.log(jsonContent);
 
fs.writeFile("./sample-data.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});


close()
