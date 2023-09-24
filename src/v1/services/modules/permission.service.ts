import { IPermission } from "../../../types";
import PermissionModel from "../../db/models/sistema/permissions.model";
import DataSource from '../../../includes/config/data.source';
import _ from "lodash";

export default class PermissionService {

    private PermissionRepository = undefined;

    constructor() {
        this.PermissionRepository = DataSource.getRepository(PermissionModel);
    }

    async findPaginate(_filter: IPermission, _options: any): Promise<void> {
        /*
        //@ts-ignore
        const data: IPaginationResponse = await UserModel.paginate(filter, options);
        return data;
        */
    }

    async findAll(module: number): Promise<IPermission[]> {
        const data = await this.PermissionRepository.find({
            where: {
                module: module
            }
        });

        return data;
    }

    async findById(module: number, id: number): Promise<IPermission | null> {
        const resource = await this.PermissionRepository.findOne({
            where: {
                id: id,
                module: module
            }
        });

        return resource;
    }

    async bulkCreate(_moduleid: number, _data: IPermission[]): Promise<boolean> {

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

        return true;
    }
}
