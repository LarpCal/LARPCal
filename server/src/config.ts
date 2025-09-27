import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

console.assert(process.env.SECRET_KEY, "SECRET_KEY must be set");
const SECRET_KEY = process.env.SECRET_KEY!;

const DATABASE_URL = process.env.DATABASE_URL;
const CORS_URL = process.env.CORS_URL;

const BCRYPT_WORK_FACTOR: number = process.env.NODE_ENV === "test" ? 1 : 13;
const PORT: number = +(process.env.PORT || 3001);

export { DATABASE_URL, SECRET_KEY, BCRYPT_WORK_FACTOR, PORT, CORS_URL };
