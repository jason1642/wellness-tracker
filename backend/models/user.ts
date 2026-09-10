import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  city: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, default: 'password' },
  birthday: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
   tracker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tracker', required: false},
});

const User = mongoose.model('User', userSchema);

export default User;