import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config/config';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwtSecret as Secret, {
    expiresIn: config.jwtExpire,
  } as SignOptions);
};

export const verifyToken = (token: string): jwt.VerifyErrors | jwt.JwtPayload | string => {
  return jwt.verify(token, config.jwtSecret);
};
