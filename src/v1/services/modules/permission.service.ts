import { IPermission, IPaginationOptions, IPaginationResponse } from "../../../types";
import PermissionModel from "../../models/sistema/permissions.model";
import DataSource from '../../../includes/config/data.source';
import _ from "lodash";

export default class PerimissionService {

    private PermissionRepository = undefined;

    constructor() {
        this.PermissionRepository = DataSource.getRepository(PermissionModel);
    }

    async findPaginate(_filter: IPermission, _options: IPaginationOptions): Promise<IPaginationResponse> {
        /*
        //@ts-ignore
        const data: IPaginationResponse = await UserModel.paginate(filter, options);
        return data;
        */
    }

    async findAll(moduleid: number): Promise<IPermission[]> {
        const data = await this.PermissionRepository.find({
            where: {
                module: moduleId
            }
        });

        return data;
    }

    async findById(moduleId: number, id: number): Promise<IPermission | null> {
        const resource = await this.PermissionRepository.findOne({
            where: {
                id: id,
                module: moduleId
            }
        });

        return resource;
    }

    async bulkCreate(moduleid: number, data: IPermission[]): Promise<boolean> {

        /*
        const dataBulk = _.map(data, (value) => {
            value.module = moduleId;
            return value;
        });

        const dataCreate = _.filter(dataBulk, (value) => value.id == null);
        const dataUpdate = _.filter(dataBulk, (value) => value.id != null);

        const dataCreateChunk = _.chunk(dataCreate, 1000);

        for (const key in dataCreateChunk) {
            await this.PermissionRepository.insert(dataCreateChunk[key]);
        }

        for (const iterator of dataUpdate) {
            await PermissionModel.updateOne(iterator.id, iterator);
        }

        return true;
        */
    }
}
