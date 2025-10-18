import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import { NotFoundError } from "./utils/expressError";

import { authenticateJWT } from "./middleware/auth";
import larpRoutes from "./routes/larps";
import usersRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import orgsRoutes from "./routes/orgs";

const app = express();

const corsOptions = {
  origin: process.env.CORS_URL,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/events", larpRoutes);
app.use("/users", usersRoutes);
app.use("/orgs", orgsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(() => {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
const genericErrorHandler: ErrorRequestHandler = (err, req, res) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  const status = err.status || 500;
  const message = err.message;

  res.status(status).json({
    error: { message, status },
  });
};
app.use(genericErrorHandler);

export default app;
