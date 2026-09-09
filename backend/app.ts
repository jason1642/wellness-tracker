import express, { type Express, type Request, type Response } from 'express';
import db from './database.ts'



const app: Express = express();
const port = 3001;

db.connect();


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});