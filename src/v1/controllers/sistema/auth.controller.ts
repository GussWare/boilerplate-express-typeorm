import { Request, Response } from "express";
import UserService from "../../services/users/user.service";
import TokenService from "../../services/token/token.service";
import AuthService from "../../services/users/auth.service";
import resetPasswordEmail from "../../services/emails/ResetPasswordEmail";
import verificationEmail from "../../services/emails/VerificationEmail";
import httpStatus from "http-status";
import { IUser } from "../../../types";

class AuthController {

    private TokenService = undefined;
    private UserService = undefined;
    private AuthService = undefined;

    constructor() {
        this.TokenService = new TokenService();
        this.UserService = new UserService();
        this.AuthService = new AuthService();
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const user = await this.AuthService.login(email, password);
        const tokens = await this.TokenService.generateTokenAuthentication(user);

        res.status(httpStatus.OK).json({ user, tokens });
    }

    async logout(req: Request, res: Response): Promise<void> {
        await this.AuthService.logout(req.body.refreshToken);

        res.status(httpStatus.OK).send();
    }

    async register(req: Request, res: Response): Promise<void> {
        const user = await this.UserService.create(req.body);
        const tokens = await this.TokenService.generateTokenAuthentication(user);

        res.status(httpStatus.CREATED).json({ user, tokens });
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.body;
        const tokens = await this.AuthService.refreshAuth(refreshToken);

        res.status(httpStatus.OK).json({ ...tokens });
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const resetPassword = await this.TokenService.generateTokenResetPassword(email);

        await resetPasswordEmail.send(email, resetPassword);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const { token } = req.query;
        const { password } = req.body;

        await this.AuthService.resetPassword(token, password);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async sendVerifiedEmail(req: Request, res: Response): Promise<void> {
        const user = req.user as IUser;
        const verifyEmailToken = await this.TokenService.generateTokenVerifyEmail(user);

        await verificationEmail.send(user.email, verifyEmailToken);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        const { token } = req.query;

        await this.AuthService.verifyEmail(token);

        res.status(httpStatus.NO_CONTENT).send();
    }
}

export default new AuthController();