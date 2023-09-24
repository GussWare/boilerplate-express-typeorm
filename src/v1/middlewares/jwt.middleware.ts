const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
import UserService from '../services/users/user.service';
import config from '../../includes/config/config';
import * as constants from '../../includes/config/constants';
import { Request } from 'express';
import { IPayloadJWT } from '../../types';

class JwtMiddleware {
  protected JwtOptions: { secretOrKey: string; jwtFromRequest: (req: Request) => string };
  protected UserService = undefined;

  constructor() {
    this.JwtOptions = {
      secretOrKey: config.jwt.secret,
      jwtFromRequest: (ExtractJwt.fromAuthHeaderAsBearerToken()) ? ExtractJwt.fromAuthHeaderAsBearerToken() : "",
    };

    this.UserService = new UserService();
  }

  async verify(payload: IPayloadJWT, done: any) {
    try {
      if (payload.type !== constants.TOKEN_TYPE_ACCESS) {
        throw new Error('Invalid token type');
      }
      const user = await this.UserService.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }

  getStrategy() {
    const jwtStrategy = new JwtStrategy(this.JwtOptions, this.verify);
    return jwtStrategy;
  }
}

export default new JwtMiddleware();