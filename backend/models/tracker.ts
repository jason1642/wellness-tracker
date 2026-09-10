import mongoose from 'mongoose';

const { Schema } = mongoose;

  const sleepSchema = new mongoose.Schema({
 timestamp: { type: Date, required: true },
        sleepMinutes: { type: Number, required: true }
  })

  const waterSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    ouncesDrank: { type: Number, required: true }
  })

  const caloriesSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    caloriesConsumed: { type: Number, required: true }
  })

  const stepsSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    stepsTaken: { type: Number, required: true }
  })



const trackerSchema = new Schema({
  user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
sleep_data: {
    type: [sleepSchema],
    default: []
},
water_data: {
    type: [waterSchema],
    default: []
},
calories_data: {
    type: [caloriesSchema],
    default: []
},
steps_data: {
    type: [stepsSchema],
    default: []
}
});

const Tracker = mongoose.model('Tracker', trackerSchema);

export default Tracker;