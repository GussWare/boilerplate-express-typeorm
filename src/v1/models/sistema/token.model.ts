import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import * as constants from "../../../includes/config/constants"
import { UserModel } from "./user.model";

@Entity("tokens")
export class TokenModel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    token: string;

    @ManyToOne(() => UserModel)
    @JoinColumn({ name: "user_id" })
    user: UserModel;

    @Column({
        type: "enum",
        enum: [
            constants.TOKEN_TYPE_REFRESH,
            constants.TOKEN_TYPE_RESET_PASSWORD,
            constants.TOKEN_TYPE_VERIFY_EMAIL
        ],
        default: constants.TOKEN_TYPE_REFRESH
    })
    type: string;

    @Column("timestamp")
    expires: Date;

    @Column({ default: false })
    blacklisted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
