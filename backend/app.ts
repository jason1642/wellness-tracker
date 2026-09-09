import express, { type Express, type Request, type Response } from 'express';
import db from './database.ts';
import userRoutes from './routes/user.ts';


const app: Express = express();
const port = 3001;

db.connect();

app.use(express.json());

app.use('/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});