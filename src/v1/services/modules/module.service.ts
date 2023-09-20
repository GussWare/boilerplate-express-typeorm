import { ICrudService, IModule, IModuleFilter } from "../../../types"
import DataSource from '../../../includes/config/data.source';
import ModuleModel from "../../models/sistema/module.model"
import * as constants from "../../../includes/config/constants"
import PermissionService from "./permission.service";
import _ from "lodash"
import ApiError from "../../../includes/library/api.error.library";
import httpStatus from "http-status";

export default class ModuleService implements ICrudService<IModule> {
  private ModuleRepository = undefined;
  private PermissionService = undefined;

  constructor() {
    this.ModuleRepository = DataSource.getRepository(ModuleModel);
    this.PermissionService = new PermissionService();
  }

  //@ts-ignore
  async findPaginate(_filter: IModuleFilter, _options: IPaginationOptions): Promise<IPaginationResponse> {
    /*
    //@ts-ignore
    const data: IPaginationResponse = await ModuleModel.paginate(filter, options);
    return data;
    */
  }

  async findAll(): Promise<IModule[]> {
    const data = await this.ModuleRepository.find();
    return data;
  }

  async findById(id: number): Promise<IModule | null> {
    const resource = await this.ModuleRepository.findOne({
      where: {
        id: id,
        enabled: true
      }
    });

    return resource;
  }

  async findBySlug(slug: string): Promise<IModule | null> {
    const resource = await this.ModuleRepository.findOne({
      where: {
        slug: slug,
        enabled: true
      }
    });

    return resource;
  }

  async create(data: IModule): Promise<IModule> {
    //@ts-ignore
    if (await ModuleModel.isModuleNameTaken(data.name)) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_MODULE_NAME_ALREADY_TAKEN"));
    }

    // @ts-ignore
    if (await ModuleModel.isModuleSlugTaken(data.slug)) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_MODULE_SLUG_ALREADY_TAKEN"));
    }

    let resource = await this.ModuleRepository.create(data);

    if (resource && data.actions) {
      //@ts-ignore
      await this.PermissionService.bulkCreate(resource.id, data.actions);
    }

    return resource;
  }

  async update(id: number, data: IModule): Promise<IModule | null> {
    const ModuleDB = await this.findById(id);

    if (!ModuleDB) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_NOT_FOUND"));
    }

    //@ts-ignore
    if (await ModuleModel.isModuleNameTaken(data.name, id)) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_ModuleNAME_ALREADY_TAKEN"));
    }

    const dataUpdate = _.extend(ModuleDB, data);
    const result = await this.ModuleRepository.update(id, dataUpdate);

    if (!result.ok) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_UPDATE_Module"));
    }

    const resource = await this.findById(id);

    if (resource && data.actions) {
      await this.PermissionService.bulkCreate(id, data.actions);
    }

    return resource;
  }

  async delete(id: number): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await this.ModuleRepository.delete({ id: id });

    return true;
  }

  async enabled(id: number): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await this.ModuleRepository.update(id, { enabled: constants.SI });

    return true;
  }

  async disabled(id: number): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await this.ModuleRepository.update(id, { enabled: constants.NO });

    return true;
  }

  async bulkCreate(data: IModule[]): Promise<boolean> {
    const dataChunk = _.chunk(data, 1000);

    for (const key in dataChunk) {
      await this.ModuleRepository.insert(dataChunk[key]);
    }

    return true;
  }
}