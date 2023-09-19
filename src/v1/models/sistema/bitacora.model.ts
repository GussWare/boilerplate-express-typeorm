import { UserModel } from "./user.model";

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";

@Entity("users")
export class BitacoraModel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    model: string;

    @Column({ type: "varchar", length: 255 })
    permission: string;

    @Column({ name: "username", type: "varchar", length: 255 })
    userName: string;

    @ManyToOne(() => UserModel)
    @JoinColumn({ name: "user_id" })
    user: UserModel;

    @CreateDateColumn()
    createdAt: Date;
}