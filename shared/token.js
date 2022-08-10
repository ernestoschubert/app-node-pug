import jwt from 'jsonwebtoken';

export const generateId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export const generateJWT = (id) => jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d', });
