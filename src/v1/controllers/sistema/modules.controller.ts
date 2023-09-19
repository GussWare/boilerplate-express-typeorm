import { Request, Response } from 'express'
import httpStatus from 'http-status'
import ApiError from '../../../includes/library/api.error.library';
import { IModule, IController } from '../../../types';
import ModuleService from '../../services/modules/module.service'
import _ from "lodash"

class ModulesController implements IController {

    private ModuleService = undefined;

    constructor() {
        this.ModuleService = new ModuleService();
    }

    async findPaginate(_req: Request, _res: Response): Promise<void> {
        /*
        const filter: IModuleFilter = _.pick(req.query, ["name", "slug", "enabled", "guard"]) as IModuleFilter;
        const options: IPaginationOptions = {
            search: req.query.search,
            sortBy: req.query.sortBy,
            //@ts-ignore
            limit: parseInt(req.query.limit),
            //@ts-ignore
            page: parseInt(req.query.page)
        } as IPaginationOptions

        const data = await moduleService.findPaginate(filter, options);

        res.status(httpStatus.OK).json(data);
        */
    }

    async findAll(_req: Request, res: Response): Promise<void> {
        const data = await this.ModuleService.findAll();

        res.status(httpStatus.OK).json(data);
    }

    async findById(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const resource = await this.ModuleService.findById(id);

        if (!resource) {
            //@ts-ignore
            throw new ApiError(httpStatus.NOT_FOUND, global.polyglot.t("USERS_ERROR_USER_NOT_FOUND"));
        }

        res.status(httpStatus.OK).json({ module: resource });
    }

    async create(req: Request, res: Response): Promise<void> {
        const data: IModule = req.body;
        const resource = await this.ModuleService.create(data);

        res.status(httpStatus.OK).json({ module: resource });
    }

    async update(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const data = req.body;

        const resource = await this.ModuleService.update(id, data);

        res.status(httpStatus.OK).json({ module: resource });
    }

    async delete(req: Request, res: Response): Promise<void> {
        const id = req.params.id;

        await this.ModuleService.delete(id);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async enabled(req: Request, res: Response): Promise<void> {
        const id = req.params.id;

        await this.ModuleService.enabled(id);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async disabled(req: Request, res: Response): Promise<void> {
        const id = req.params.id;

        await this.ModuleService.disabled(id);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async bulkCreate(req: Request, res: Response): Promise<void> {

        const data: IModule[] = req.body;

        await this.ModuleService.bulkCreate(data);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async bulkDelete(req: Request, res: Response): Promise<void> {

        const data: IModule[] = req.body;

        await this.ModuleService.bulkDelete(data);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async bulkEnabled(req: Request, res: Response): Promise<void> {

        const data: IModule[] = req.body;

        await this.ModuleService.bulkEnabled(data);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async bulkDisabled(req: Request, res: Response): Promise<void> {

        const data: IModule[] = req.body;

        await this.ModuleService.bulkEnabled(data);

        res.status(httpStatus.NO_CONTENT).send();
    }
}

export default new ModulesController();