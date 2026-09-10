import mongoose from 'mongoose';

const { Schema } = mongoose;

  const sleepSchema = new mongoose.Schema({
 timestamp: { type: Date, required: true },
        sleepMinutes: { type: Number, required: true }
  })

//   const waterSchema = new mongoose.Schema({
//     timestamp: { type: Date, required: true },
//     ouncesDrank: { type: Number, required: true }
//   })

//   const caloriesSchema = new mongoose.Schema({
//     type: Number, required: false, default: 2200
//   })

//   const stepsSchema = new mongoose.Schema({
//     timestamp: { type: Date, required: true },
//     stepCount: { type: Number, required: true }
//   })



const trackerSchema = new Schema({
  user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
sleep_data: {
    type: [sleepSchema],
    default: []
},
water_data: {
    type: Number,
    default: 15
},
calories_data: {
    type: Number,
    default: 2200
},
steps_data: {
    type: Number,
    default: 8500
}
});

const Tracker = mongoose.model('Tracker', trackerSchema);

export default Tracker;