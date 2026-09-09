import { Router, type Request, type Response } from 'express';

const router = Router();
// Find all users
router.get('/', (req: Request, res: Response) => {
  res.send('Get all users');
});

// Find user by id
router.get('/:id', (req: Request, res: Response) => {
  res.send('Get all users');
});

// Create user
router.post('/', (req: Request, res: Response) => {
  res.send('Get all users');
});

export default router;