import { Router, Request, Response } from 'express';

import { User } from '../models/User';
import { AuthRouter } from './auth.router';

const router: Router = Router();

router.use('/auth', AuthRouter);

router.get('/');

router.get('/:id', async (req: Request, res: Response) => {
  console.log("New GET USER ID request from ID: " + req.reqId);

  const { id } = req.params;
  const item = await User.findByPk(id);
  res.send(item);
});

export const UserRouter: Router = router;
