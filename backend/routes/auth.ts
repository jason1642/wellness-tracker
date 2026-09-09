import User from '../models/user.ts';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import 'dotenv/config';


const authRouter = express.Router();

// Login route

//login - Not using joi validation
authRouter.post('/login', async (req, res) => {
  // First use mongoose schema with Joi validator to see if username and
  // password are valid input, not valid matching password

  //  Now find the user by their email
  let user = await User.findOne({ email: req.body.email });
  if (!user) {  
    return res.status(400).send('Incorrect email');
  }
//   console.log(user)
//   console.log(user.password == req.body.password)
  // Then validate the Credentials in MongoDB match those provided in the request.
  // Will return false if password was not encrypted during creation despite matching.
  // Shall not accept matching unencrpyted password for security reasons.
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  console.log(validPassword)

//   if (!validPassword) return res.status(400).send('Incorrect email or password.');
  // If verified, return a jwt, and user id & username
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  console.log('this is token ' + token)
  // Set tokens to header and return basic user info,
  res.header({ 'x-auth-token': token, 'authorization': `Bearer ${token}` })
    .send(_.assign({ token: token }, _.pick(user, ['_id', 'email', 'username', 'created_at', 'updated_at', 'followers', 'following', 'profile_image', 'bio'])));
  // console.log(req.headers)
});

export default authRouter;