import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const OPENAI_API_KEY: string = process.env.API_KEY as string;
const SECRET_KEY: string = process.env.SECRET_KEY as string;
const DATABASE_URL: string = process.env.DATABASE_URL as string;
const CORS_URL: string = process.env.CORS_URL as string;

const BCRYPT_WORK_FACTOR: number = process.env.NODE_ENV === 'test' ? 1 : 13;
const PORT: number = +(process.env.PORT || 3001);

export {
  DATABASE_URL,
  OPENAI_API_KEY,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  PORT,
  CORS_URL,
};
