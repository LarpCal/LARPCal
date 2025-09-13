import { Request, Response, NextFunction } from 'express';
import express from 'express';
const router = express.Router();

import jsonschema from 'jsonschema';
import passwordResetSchema from '../schemas/passwordReset.json';
import userAuthSchema from '../schemas/userAuth.json';
import userRegisterSchema from '../schemas/userRegister.json';

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/expressError';
import { createToken } from '../utils/tokens';

import UserManager from '../models/UserManager';
import { PasswordResetRequest, UserForCreate } from '../types';
import AuthManager from '../models/AuthManager';
import * as jwt from 'jsonwebtoken';
import { SECRET_KEY, CORS_URL } from '../config';
import { sendPasswordResetEmail } from '../utils/emailHandler';
import { ensureCorrectUserOrAdmin, ensureLoggedIn } from '../middleware/auth';

router.post('/error', async () => {
  throw new BadRequestError('test error');
});

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post(
  '/token',
  async function (req: Request, res: Response, next: NextFunction) {
    const validator = jsonschema.validate(req.body, userAuthSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs = validator.errors.map((e: Error) => e.stack);
      throw new BadRequestError(errs.join(', '));
    }

    const { username, password } = req.body;
    const user = await UserManager.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  },
);

/** POST /auth/token/refresh => { token }
 *
 * Regenerates JWT token which can be used to authenticate further requests.
 *
 * Authorization required: Logged in
 */

router.post(
  '/token/refresh',
  ensureLoggedIn,
  async function (req: Request, res: Response, next: NextFunction) {
    const { username } = res.locals.user;
    const user = await UserManager.getUser(username);
    const token = createToken(user);
    return res.json({ token });
  },
);

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post(
  '/register',
  async function (req: Request, res: Response, next: NextFunction) {
    const validator = jsonschema.validate(req.body, userRegisterSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs = validator.errors.map((e: Error) => e.stack);
      throw new BadRequestError(errs.join(', '));
    }

    const newUser = await UserManager.register({
      ...(req.body as Omit<UserForCreate, 'isAdmin'>),
      isAdmin: false,
    });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  },
);

/** Generates a new PasswordResetRequest record and emails a link to the user
 * containing a tokenized link for setting a new password
 */
router.post(
  '/password-reset/request',
  async function (req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;
    if (!username) throw new BadRequestError('Invalid username');

    try {
      const passwordResetRequest =
        await AuthManager.createPasswordResetRequest(username);

      //create token
      const token = jwt.sign(passwordResetRequest, SECRET_KEY, {
        expiresIn: '10m',
      });

      //send email with magic link
      const link = `${CORS_URL}/auth/password-reset/confirm?token=${token}`;
      sendPasswordResetEmail(passwordResetRequest.user.email, username, link);

      return res
        .status(200)
        .set('Content-Type', 'text/html')
        .send('Request Recieved');
    } catch (e) {
      if (e instanceof NotFoundError) {
        //Fail silently. Do not verify that username doesn't exist
        return res
          .status(200)
          .set('Content-Type', 'text/html')
          .send('Request Recieved');
      } else {
        throw e;
      }
    }
  },
);

router.patch(
  '/password-reset/confirm',
  async function (req: Request, res: Response, next: NextFunction) {
    //authenticate token
    const { token } = req.query;
    if (!token) throw new UnauthorizedError('Unauthorized');

    try {
      jwt.verify(token as string, SECRET_KEY);
    } catch (err) {
      if ((err.message = 'jwt expired')) {
        throw new BadRequestError('Sorry - this link has expired.');
      } else {
        throw err;
      }
    }

    //check against database records (has this been used?)
    const { id, username } = jwt.decode(
      token as string,
    ) as PasswordResetRequest;
    try {
      await AuthManager.getPasswordResetRequest(id);
    } catch (e) {
      throw new BadRequestError('This request is no longer valid');
    }

    //validate form data
    const validator = jsonschema.validate(req.body, passwordResetSchema, {
      required: true,
    });
    if (!validator.valid) {
      const errs = validator.errors.map((e: Error) => e.stack);
      throw new BadRequestError(errs.join(', '));
    }

    //process form and cleanup
    const updatedUser = await UserManager.updateUser(username, req.body);
    await AuthManager.clearPasswordResetRequests(username);

    return res.json({ user: updatedUser });
  },
);

export default router;
