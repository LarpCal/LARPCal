import express, { type Request, type ErrorRequestHandler } from "express";
import cors from "cors";
import { InputValidationError, NotFoundError } from "./utils/expressError.ts";

import { authenticateJWT } from "./middleware/auth.ts";
import larpRoutes from "./routes/larps.ts";
import usersRoutes from "./routes/users.ts";
import authRoutes from "./routes/auth.ts";
import orgsRoutes from "./routes/orgs.ts";
import newslettersRoutes from "./routes/newsletters.ts";

const app = express();

const corsCallback: cors.CorsOptionsDelegate<Request> = (req, callback) => {
  try {
    const url = new URL(`${req.protocol}://${req.get("HOST")}${req.url}`);
    const { origin, pathname } = url;
    const corsOptions = {
      origin: process.env.CORS_URL,
      optionsSuccessStatus: 200,
    } satisfies cors.CorsOptions;

    if (
      pathname.endsWith("/calendar/share") ||
      process.env.NODE_ENV === "test"
    ) {
      corsOptions.origin = "*";
    } else if (
      origin?.endsWith("larpcal.netlify.app") &&
      process.env.CONTEXT === "deploy-preview"
    ) {
      corsOptions.origin = origin;
    }

    callback(null, corsOptions);
  } catch (err) {
    console.error(`CORS error with ${req.url}:`, err, req.get("host"));
    callback(new Error("Not allowed by CORS"));
  }
};

app.use(cors(corsCallback));
app.use(express.json());
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/events", larpRoutes);
app.use("/users", usersRoutes);
app.use("/orgs", orgsRoutes);
app.use("/newsletters", newslettersRoutes);

/** Handle 404 errors -- this matches everything */
app.use(() => {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
const genericErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  const status = err.status || 500;
  const message = err.message;

  if (err instanceof InputValidationError) {
    res.status(status).json({
      error: { message, status, errors: err.errors },
    });
  } else {
    res.status(status).json({
      error: { message, status },
    });
  }
};
app.use(genericErrorHandler);

export default app;
