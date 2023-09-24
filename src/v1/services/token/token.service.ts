import DataSource from '../../../includes/config/data.source';
import { IAccessToken, IToken, ITokenPayload, IUser } from "../../../types";
import TokenModel from "../../db/models/sistema/token.model";
import config from "../../../includes/config/config";
import * as constants from "../../../includes/config/constants";
import ApiError from "../../../includes/library/api.error.library";
import _ from "lodash";
import moment from "moment";
import jwt from "jsonwebtoken";
import HttpStatus from "http-status";
import UserService from "../users/user.service";

export default class TokenService {

    private TokenRepository = undefined;
    private UserService = undefined;

    constructor() {
        this.TokenRepository = DataSource.getRepository(TokenModel);
        this.UserService = new UserService();
    }

    async create(data: IToken): Promise<IToken> {
        const token = await this.TokenRepository.create(data);
        return token;
    }

    async findByToken(token: string, type: string = null, blacklist: boolean = false) {
        const where = {
            token: token,
            blacklist: blacklist
        };

        if (type) {
            where['type'] = type;
        }

        const result = await this.TokenRepository.findOne({
            where: where
        });

        return result;
    }

    async deleteByUserAndType(userId: number, type: string) {
        await this.TokenRepository.delete({
            user_id: userId,
            type: type
        });
    }

    async verify(token: string, type: string) {
        const payload = jwt.verify(token, config.jwt.secret);
        const tokenDoc = await this.TokenRepository.findOne({
            where: {
                token: token,
                type: type,
                user: payload.sub,
                blacklisted: false
            }
        });

        if (!tokenDoc) {
            throw new ApiError(HttpStatus.NOT_FOUND, "Token not found");
        }

        return tokenDoc;
    }

    async generateToken(userId: number, expires: any, type: string): Promise<string> {
        const secret = config.jwt.secret;

        const payload: ITokenPayload = {
            sub: userId,
            iat: moment().unix(),
            exp: expires.unix(),
            type: type
        };

        const token = jwt.sign(payload, secret);

        return token;
    }

    async generateTokenAuthentication(user: IUser): Promise<IAccessToken> {
        if (!user || !user.id) {
            throw new ApiError(HttpStatus.NOT_FOUND, "User not Found");
        }

        const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
        const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, "days");

        const accessToken = await this.generateToken(user.id, accessTokenExpires, constants.TOKEN_TYPE_ACCESS);
        const refreshToken = await this.generateToken(user.id, refreshTokenExpires, constants.TOKEN_TYPE_REFRESH);

        const token: IToken = {
            token: refreshToken,
            user: user.id,
            expires: refreshTokenExpires,
            blacklisted: false,
            type: constants.TOKEN_TYPE_REFRESH
        };

        await this.create(token);

        const accessTokens: IAccessToken = {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };

        return accessTokens;
    }


    async generateTokenResetPassword(email: string): Promise<string> {
        const user = await this.UserService.findByEmail(email);

        if (!user || !user.id) {
            throw new ApiError(HttpStatus.NOT_FOUND, "No users found with this email");
        }

        const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, "minutes");
        const resetTokenPassword = await this.generateToken(user.id, expires, constants.TOKEN_TYPE_RESET_PASSWORD);

        const token: IToken = {
            token: resetTokenPassword,
            user: user.id,
            expires: expires,
            blacklisted: false,
            type: constants.TOKEN_TYPE_RESET_PASSWORD
        };

        await this.create(token);

        return resetTokenPassword;
    }

    async generateTokenVerifyEmail(user: IUser): Promise<IToken> {
        if (!user || !user.id) {
            throw new ApiError(HttpStatus.NOT_FOUND, "No users found with this email");
        }

        const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, "minutes");
        const tokenString = await this.generateToken(user.id, expires, constants.TOKEN_TYPE_VERIFY_EMAIL);

        const tokenVerifyEmail: IToken = {
            user: user.id,
            expires: expires,
            token: tokenString,
            blacklisted: false,
            type: constants.TOKEN_TYPE_VERIFY_EMAIL
        };

        await this.create(tokenVerifyEmail);

        return tokenVerifyEmail;
    }

}