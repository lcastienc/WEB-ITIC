import jwt from 'jsonwebtoken';

const secretKey = 'fldsmdfr';

export async function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    console.error('Authorization header missing');
    throw new Error('Authorization header missing');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('Token missing');
    throw new Error('Token missing');
  }

  try {
    jwt.verify(token, secretKey);
    console.log('Token verified successfully');
    return true;
  } catch (err) {
    console.error('Invalid token:', err);
    throw new Error('Invalid token');
  }
}
