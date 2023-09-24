import { Request, Response } from "express";

declare namespace NodeJS {
	interface Global {
		polyglot: any;
	}
}

export interface IPaginationOptions {
	sortBy?: string;
	limit: number;
	page: number;
	populate?: string;
	search?: string;
}

export interface IPaginationResponse {
	results: any[],
	page: number,
	limit: number,
	totalPages: number,
	totalResults: number
}

export interface IColumnSearch {
	[key: string]: {
		$regex: string;
		$options: string;
	};
}

export interface Img {
	name: string;
	imgUrl: string;
	thumbnailUrl?: string;
}

export interface IUser {
	id?: number;
	name?: string;
	surname?: string;
	username?: string;
	picture?: string;
	email?: string;
	password?: string;
	role?: string;
	isEmailVerified?: boolean;
	enabled?: boolean;
}

export interface IPayloadJWT {
	sub?: any;
	type?: any;
}

export interface IToken {
	token: any;
	user: any;
	type: string;
	expires: any;
	blacklisted: boolean;
}

export interface ITokenFilter {
	token?: string;
	user?: number; // Cambiado a number
	type?: string;
	blacklisted?: boolean;
}

export interface ITokenExpiresToken {
	token: string;
	expires: Date;
}

export interface IAccessToken {
	access: ITokenExpiresToken;
	refresh: ITokenExpiresToken;
}

export interface IModule {
	id?: number;
	name?: string;
	slug?: string;
	guard?: string;
	description?: string;
	permissions?: IPermission[];
}

export interface IModuleFilter {
	name?: string;
	slug?: string;
	guard?: string;
	description?: string;
}

export interface IPermission {
	id?: number;
	name?: string;
	slug?: string;
	guard?: string;
	description?: string;
	module?: string;
}

export interface IPermissionFilter {
	name?: string;
	slug?: string;
	guard?: string;
	module?: string;
	enabled?: boolean;
}

export interface IRole {
	id?: number;
	name?: string;
	slug?: string;
	guard?: string;
	description?: string;
}

export interface IRoleFilter {
	name?: string;
	slug?: string;
	guard?: string;
}

export interface IBitacora {
	id?: number;
	user?: number;
	module?: string;
	permission?: string;
	description?: string;
	date?: Date;
}

export interface IBitacoraFilter {
	user?: number;
	module?: string;
	action?: string;
	startDate?: Date;
	endDate?: Date;
}

export interface IController {
	findPaginate?(req: Request, res: Response): Promise<void>;
	findAll?(req: Request, res: Response): Promise<void>;
	findById?(req: Request, res: Response): Promise<void>;
	create?(req: Request, res: Response): Promise<void>;
	update?(req: Request, res: Response): Promise<void>;
	enabled?(req: Request, res: Response): Promise<void>;
	disabled?(req: Request, res: Response): Promise<void>;
	bulk?(req: Request, res: Response): Promise<void>;
}

export interface ICrudService<T> {
	findPaginate?(filter: T, options: IPaginationOptions): Promise<IPaginationResponse>;
	findAll?(): Promise<T[]>;
	findById?(id: number): Promise<T | null>;
	create?(data: T): Promise<T>;
	update?(id: number, data: T): Promise<T | null>;
	enabled?(id: number): Promise<boolean>;
	disabled?(id: number): Promise<boolean>;
	bulkCreate?(data: T[]): Promise<boolean>;
	bulkDelete?(ids: number[]): Promise<boolean>;
	bulkEnabled?(ids: number[]): Promise<boolean>;
	bulkDisabled?(ids: number[]): Promise<boolean>;
	clear?(): Promise<boolean>;
}

export interface ITokenPayload {
	sub: number;
	iat: number;
	exp: number;
	type: string;
}

export interface IAuthLogin {
	email: string;
	password: string;
}

export interface IAuthRefreshToken {
	refreshToken: string;
}

export interface IAuthToken {
	token: string;
	expires: string;
}

export interface IResponseTokenAuth {
	access: IAuthToken;
	refresh: IAuthToken;
}

export interface IFaker {
	make(): Promise<void>;
}

export interface ILanguage {
	id?: number;
	name?: string;
	slug?: string;
	description?: string;
	default?: boolean;
	enabled?: boolean;
}

export interface ILanguageFilter {
	name?: string;
	slug?: string;
	default?: boolean;
	enabled?: boolean;
}
