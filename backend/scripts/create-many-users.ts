import fs from 'fs'
import mongoose from 'mongoose'
import 'dotenv/config';
import User from '../models/user.ts';
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

  const resultArray =  users.map((ele, key ) => {
    // console.log(categories[Math.floor(Math.random() * categories.length)].name)
//   const newPostId = new mongoose.Types.ObjectId()
    return new User({
        username: ele,
        email: `${ele}@email.net`,
        password: "password",
        // _id: newPostId
    })
})

console.log(resultArray)
documentsArray = resultArray;

await User.insertMany(resultArray)
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
