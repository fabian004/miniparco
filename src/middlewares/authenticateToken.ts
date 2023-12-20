import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  user?: string;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY!, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      const user = decoded as UserPayload;
      (req as any).user = user;
      
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
