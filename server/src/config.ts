import dotenv from "dotenv";
import assert from "node:assert";
import { toValidId } from "./utils/helpers";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

assert(process.env.SECRET_KEY, "SECRET_KEY must be set");
export const SECRET_KEY = process.env.SECRET_KEY!;

export const DATABASE_URL = process.env.DATABASE_URL;
export const CORS_URL = process.env.CORS_URL;

export const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;
export const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 3001;

export const BREVO_API_KEY = process.env.BREVO_API_KEY;
export const BREVO_ADMIN_SEGMENT_ID = toValidId(
  process.env.BREVO_ADMIN_SEGMENT_ID,
);
export const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
