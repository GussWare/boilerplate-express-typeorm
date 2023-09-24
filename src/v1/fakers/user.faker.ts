import { IFaker, IUser } from "../../types";
//@ts-ignore
import faker from "faker";
import _ from "lodash";
import UserService from "../services/users/user.service";

class UserFaker implements IFaker {

    private UserService = undefined;

    constructor() {
        this.UserService = new UserService();
    }

    async make(): Promise<void> {
        await this.UserService.clear();

        let adminData: IUser = {
            name: "Gustavo",
            surname: "Avila Medina",
            username: "gussware",
            email: "gussware@gmail.com",
            password: "123qweAA",
            role: "1",
            isEmailVerified: true,
            enabled: true
        };

        await this.UserService.create(adminData);

        const dataInsert = [];

        for (let i = 0; i < 100; i++) {
            let password = faker.internet.password();
            let firstName = faker.name.firstName();
            let lastName = faker.name.lastName();

            let data: IUser = {
                name: firstName,
                surname: lastName,
                username: faker.internet.userName(firstName, lastName),
                email: faker.internet.email(firstName, lastName),
                password: password,
                role: "2",
                isEmailVerified: faker.datatype.boolean(),
                enabled: faker.datatype.boolean()
            };

            dataInsert.push(data);
        }

        await this.UserService.bulkCreate(dataInsert);
    }
}

export default new UserFaker();