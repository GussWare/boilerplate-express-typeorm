import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../../includes/library/api.error.library";
import { IPermissionFilter, IController } from "../../../types";
import PermissionService from "../../services/modules/permission.service";
import ModuleService from "../../services/modules/module.service";
import _ from "lodash"

class PermisionController implements IController {
    private ModuleService = undefined;
    private PermissionService = undefined;

    constructor() {
        this.ModuleService = new ModuleService();
        this.PermissionService = new PermissionService();
    }

    async findPaginate(req: Request, res: Response): Promise<void> {
        const id = req.params.moduleId;

        if (!id)
            //@ts-ignore
            throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("ACTIONS_ERROR_MODULE_ID_REQUIRED"));

        const module_data = await this.ModuleService.findById(id);

        if (!module_data)
            //@ts-ignore
            throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_DISABLED"));


        const filter: IPermissionFilter = _.pick(req.query, ["name", "slug", "guard", "enabled"]) as IPermissionFilter;
        const options: IPaginationOptions = {
            search: req.query.search,
            sortBy: req.query.sortBy,
            //@ts-ignore
            limit: parseInt(req.query.limit),
            //@ts-ignore
            page: parseInt(req.query.page)
        } as IPaginationOptions

        const data = await this.PermissionService.findPaginate(filter, options);

        res.status(httpStatus.OK).json(data);
    }

    async findAll(req: Request, res: Response): Promise<void> {
        const moduleId = req.params.moduleId;
        const data = await this.PermissionService.findAll(moduleId);

        res.status(httpStatus.OK).json(data);
    }
}

export default new PermisionController();