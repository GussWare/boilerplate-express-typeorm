import UserService from "./user.service"
import TokenService from "../token/token.service";
import httpStatus from "http-status";
import ApiError from "../../../includes/library/api.error.library";
import * as constants from "../../../includes/config/constants";
import { IAccessToken, IUser } from "../../../types";

export default class AuthService {

    private TokenService = undefined;
    private UserService = undefined;

    constructor() {
        this.TokenService = new TokenService();
        this.UserService = new UserService();
    }

    async login(email: string, password: string): Promise<IUser> {
        const user = await this.UserService.findByEmail(email);

        if (!user || !user.enabled) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, "USERS_ERROR_USER_NOT_FOUND");
        }

        //@ts-ignore
        const isPassWordMatch = await user.isPasswordMatch(password);

        if (!isPassWordMatch) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("USERS_ERROR_INCORRECT_EMAIL_AND_OR_PASSWORD"));
        }

        return user;
    }

    async logout(refreshToken: string): Promise<boolean> {
        const refreshTokenDoc = await this.TokenService.findByToken(refreshToken, constants.TOKEN_TYPE_REFRESH);

        if (!refreshTokenDoc) {
            //@ts-ignore
            throw new ApiError(httpStatus.NOT_FOUND, global.polyglot.t("GENERAL_ERROR_NOT_FOUND"));
        }

        await refreshTokenDoc.remove();

        return true;
    }

    async refreshAuth(refreshToken: string): Promise<IAccessToken> {
        //@ts-ignore
        const refreshTokenDoc = await this.TokenService.verify(refreshToken, constants.TOKEN_TYPE_REFRESH);
        const user = await this.UserService.findById(refreshTokenDoc.user);

        if (!user || !user.enabled) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("AUTH_ERROR_PLEASE_AUTHENTICATE"));
        }

        await refreshTokenDoc.remove();

        const tokens = await this.TokenService.generateTokenAuthentication(user);

        return tokens;
    }

    async resetPassword(resetPassword: any, newPassword: string): Promise<boolean> {
        if (!resetPassword)
            return false;

        const resetPasswordTokenDB = await this.TokenService.verify(resetPassword, constants.TOKEN_TYPE_RESET_PASSWORD);
        const user = await this.UserService.findById(resetPasswordTokenDB.user);

        if (!user || !user.enabled) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("AUTH_ERROR_PLEASE_AUTHENTICATE"));
        }

        const data = { password: newPassword };

        await this.UserService.update(user.id, data);

        await this.TokenService.deleteByUserAndType(user.id, constants.TOKEN_TYPE_RESET_PASSWORD);

        return true;
    }

    async verifyEmail(tokenVerifyEmail: any): Promise<boolean> {
        const verifyEmailDoc = await this.TokenService.verify(tokenVerifyEmail, constants.TOKEN_TYPE_VERIFY_EMAIL);

        const user = await this.UserService.findById(verifyEmailDoc.user);

        if (!user || user.enabled) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("AUTH_ERROR_PLEASE_AUTHENTICATE"));
        }

        await this.TokenService.deleteByUserAndType(user.id, constants.TOKEN_TYPE_VERIFY_EMAIL);

        const data: IUser = {
            isEmailVerified: true
        }

        await this.UserService.update(user.id, data);

        return true;
    }
}