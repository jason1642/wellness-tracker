import { Router, type Request, type Response } from 'express';
import mongoose from 'mongoose';

import 'dotenv/config';
import _ from 'lodash';
import Tracker from '../models/tracker.ts'
const router = Router();


// Find tracker by user id
const getTrackerByUserId = async (req: Request, res: Response) => { 
console.log(req.params.user_id)
  let tracker
  try { await Tracker.findOne({ user_id: req.params.user_id }).then(ele=>tracker=ele) } catch(err) { return res.status(404).send('User id not found')}

    console.log(tracker)
  return res.send(tracker);
  

};
router.get('/:user_id', getTrackerByUserId)

export default router;