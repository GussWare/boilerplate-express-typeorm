import { IPaginationOptions, IBitacora, IBitacoraFilter } from "../../../types"
import BitacoraModel from "../../db/models/sistema/bitacora.model"
import DataSource from '../../../includes/config/data.source';
import _ from "lodash"

class BitacoraService {
  private bitacoraRepository = undefined;

  constructor() {
    this.bitacoraRepository = DataSource.getRepository(BitacoraModel);
  }

  //@ts-ignore
  async findPaginate(filter: IBitacoraFilter, options: IPaginationOptions): Promise<IPaginationResponse> {

  }


  async create(data: IBitacora): Promise<IBitacora> {
    const resource = await this.bitacoraRepository.create(data);

    return resource;
  }
}

export default new BitacoraService();