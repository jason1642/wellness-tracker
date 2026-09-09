import mongoose from 'mongoose';
import 'dotenv/config';


// console.log(process.env.MONGODB_USERNAME, "this is the process.env")
const connect = async () => await mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@portfolio-website.halgu.mongodb.net/zealthy`
).then(res=>{console.log('db connected ')}).catch(err=>{ 
  console.log(err)
  console.log('Cannot connect to database')
})


const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

const db = {connect: connect, close: close, clear: clear}
export default db 