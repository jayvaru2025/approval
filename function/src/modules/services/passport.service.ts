import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { getConfig } from '../../utils/config';

export const jwtStrategy = () => {
  const { JWT_SECRET_KEY } = getConfig();
  const option = {
    jwtFromRequest: ExtractJwt.fromHeader('token'),
    secretOrKey: JWT_SECRET_KEY,
  };

  passport.use(
    new Strategy(option, (payload, done) => {
      return done(null, payload);
    }),
  );

  return {
    authenticate: () => {
      return passport.authenticate('jwt', { session: false });
    },
  };
};
