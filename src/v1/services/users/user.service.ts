import DataSource from '../../../includes/config/data.source';
import { UserModel } from '../../models/sistema/user.model'; // Asegúrate de importar el modelo correcto
import { IUser } from "../../../types";
import ApiError from "../../../includes/library/api.error.library";
import httpStatus from "http-status";
import _ from "lodash";
import * as constants from "../../../includes/config/constants";

export default class UserService {

  private UserRepository = undefined;

  constructor() {
    this.UserRepository = DataSource.getRepository(UserModel);
  }

  async findPaginate(_filter: any, _options: any): Promise<any> {
    // Implementar la paginación usando TypeORM
  }

  async findAll(): Promise<UserModel[]> {
    return await this.UserRepository.find();
  }

  async findById(id: number): Promise<UserModel | undefined> {
    return await this.UserRepository.findOne({
      where: {
        id: id,
        enabled: constants.SI
      },
    });
  }

  async findByEmail(email: string): Promise<UserModel | undefined> {
    return await this.UserRepository.findOne({
      where: {
        email: email,
        enabled: constants.SI
      },
    });
  }

  async create(data: IUser): Promise<UserModel> {
    const exists = await this.findByEmail(data.email);

    if (exists) {
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_EMAIL_ALREADY_TAKEN"));
    }

    const user = this.UserRepository.create(data);

    return user;
  }

  async update(id: number, data: IUser): Promise<UserModel | undefined> {
    let user = await this.findById(id);

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    _.extend(user, data);

    await this.UserRepository.update(id, user);

    user = await this.findById(id);

    return user;
  }

  async enabled(id: number): Promise<boolean> {
    await this.UserRepository.update(id, { enabled: constants.SI });

    return true;
  }

  async disabled(id: number): Promise<boolean> {
    await this.UserRepository.update(id, { enabled: constants.NO });

    return true;
  }

  async bulkCreate(data: IUser[]): Promise<boolean> {
    await this.UserRepository.save(data);

    return true;
  }

  async bulkDelete(data: IUser[]): Promise<boolean> {
    await this.UserRepository.save(data);

    return true;
  }

  async bulkEnabled(data: IUser[]): Promise<boolean> {
    await this.UserRepository.save(data);

    return true;
  }

  async bulkDisabled(data: IUser[]): Promise<boolean> {
    await this.UserRepository.save(data);

    return true;
  }

}
