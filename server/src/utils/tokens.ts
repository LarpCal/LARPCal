import * as jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';
import { PublicUser, User, UserForCreate } from '../types';

/** return signed JWT {username, isAdmin} from user data. */

function createToken(user: PublicUser) {
  console.assert(
    user.isAdmin !== undefined,
    'createToken passed user without isAdmin property',
  );
  console.assert(
    user.organization && user.organization.isApproved !== (null || undefined),
    'createToken passed user without an approved organizer',
  );

  let payload = {
    username: user.username,
    isOrganizer: user.organization ? true : false,
    isApprovedOrganizer: user.organization?.isApproved,
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

export { createToken };
