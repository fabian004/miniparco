import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const login = (req: Request, res: Response) => {
  const { username } = req.body;
  const user = { username }; 

  const accessToken = jwt.sign(user, process.env.SECRET_KEY!, { expiresIn: '1h' });
  res.json({
    accessToken
  });
};
