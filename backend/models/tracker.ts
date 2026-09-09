import mongoose from 'mongoose';

const { Schema } = mongoose;

  const sleepSchema = new mongoose.Schema({
 date: { type: Date, required: true },
        minutesSlept: { type: Number, required: true }
  })

  const waterSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    ouncesDrank: { type: Number, required: true }
  })

  const caloriesSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    caloriesConsumed: { type: Number, required: true }
  })

  const stepsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    stepsTaken: { type: Number, required: true }
  })


  
const trackerSchema = new Schema({
  user_id:{
    type: {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
      email: { type: String, required: false },
    },
    required: true
},
sleep: {
    type: [sleepSchema],
    default: []
},
water: {
    type: [waterSchema],
    default: []
},
calories: {
    type: [caloriesSchema],
    default: []
},
steps: {
    type: [stepsSchema],
    default: []
}
});

const Tracker = mongoose.model('Tracker', trackerSchema);

export default Tracker;