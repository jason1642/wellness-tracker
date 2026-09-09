import { Router, type Request, type Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 
import 'dotenv/config';
import _ from 'lodash';
import User from '../models/user.ts'
const router = Router();

// Create user 
const createUser = async (req: Request, res: Response) => {
    // Without Joi validation, i need to figure out how to send an error to front end with mongoose validation
  let secret
  //Check if user already exists
  let user = await User.findOne({ $or: [
    { username: req.body.username },
    {email: req.body.email} 
  ]})

   //
  if (user) {
    return res.status(400).send('That username or email is already taken.');
  } 

  try {
    user = await new User(_.assign(_.pick(req.body, ['username', 'email', 'password'])))
    
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    console.log('RUNNING SAVE')
 
  secret = process.env.TOKEN_SECRET && process.env.TOKEN_SECRET 

    const token = jwt.sign({ _id: user._id }, secret);
    
  return res.header('x-auth-token', token).send(_.assign(_.pick(user, ['_id', 'username', 'email', 'password', 'created_at']), {token: token}));
 
  } catch (errors) { 
    console.log(errors)
    let errorMessages: any[] = []
      Object.keys(errors instanceof Error).forEach(key => errorMessages.push(errors[key].properties.message ))
    console.log(errors)
    const errorObject = {
      errors: errorMessages
    }
    return res.send(errorObject).status(403)
  }

//   res.send('Get all users');
};
router.post('/create', createUser)


// Find all users
router.get('/', (req: Request, res: Response) => {
  res.send(res);
});

// Find user by id
const getOneUser = async (req: Request, res: Response) => { 
console.log(req.params.id)
  let user
  try { await User.findOne({ _id: req.params.id }).then(ele=>user=ele) } catch(err) { return res.status(404).send('User not found')}

    console.log(user)
  return res.send(_.pick(user, ['_id', 'username', 'email', 'created_at', 'updated_at']));
  

};
router.get('/:id', getOneUser)


export default router;