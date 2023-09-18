import { IAction, IPaginationOptions, IPaginationResponse } from "../../../types";
import Permission from "../../models/sistema/permissions.model";
import _ from "lodash";

class PerimissionService {

    async findPaginate(filter: IAction, options: IPaginationOptions): Promise<IPaginationResponse> {
        //@ts-ignore
        const data: IPaginationResponse = await UserModel.paginate(filter, options);
        return data;
    }

    async findAll(moduleId: string): Promise<IAction[]> {
        const data = await PermissionModel.find({
            module: moduleId
        });

        return data;
    }

    async findById(moduleId: string, id: string): Promise<IAction | null> {
        const resource = await PermissionModel.findOne({
            module: moduleId,
            _id: id,
        });

        return resource;
    }

    async bulkCreate(moduleId: string, data: IAction[]): Promise<boolean> {
        const dataBulk = _.map(data, (value) => {
            value.module = moduleId;
            return value;
        });

        const dataCreate = _.filter(dataBulk, (value) => value.id == null);
        const dataUpdate = _.filter(dataBulk, (value) => value.id != null);

        const dataCreateChunk = _.chunk(dataCreate, 1000);

        for (const key in dataCreateChunk) {
            await PermissionModel.insertMany(dataCreateChunk[key]);
        }

        for (const iterator of dataUpdate) {
            await PermissionModel.updateOne(iterator.id, iterator);
        }

        return true;
    }
}


export default new PerimissionService();