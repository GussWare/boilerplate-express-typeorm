import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../../includes/library/api.error.library";
import { IPermissionFilter, IController, IPaginationOptions } from "../../../types";
import PerimissionService from "../../services/modules/permission.service";
import moduleService from "../../services/modules/module.service";
import _ from "lodash"

class ActionsController implements IController {

    async findPaginate(req: Request, res: Response): Promise<void> {
        const moduleId = req.params.moduleId;

        if (!moduleId)
            //@ts-ignore
            throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("ACTIONS_ERROR_MODULE_ID_REQUIRED"));

        const module_data = moduleService.findById(moduleId);

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

        const data = await PerimissionService.findPaginate(filter, options);

        res.status(httpStatus.OK).json(data);
    }


    async findAll(req: Request, res: Response): Promise<void> {
        const moduleId = req.params.moduleId;
        const data = await PerimissionService.findAll(moduleId);

        res.status(httpStatus.OK).json(data);
    }


}


export default new ActionsController();