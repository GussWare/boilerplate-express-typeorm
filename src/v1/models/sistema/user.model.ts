import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate
} from "typeorm";
import bcrypt from "bcryptjs";

@Entity("users")
export class UserModel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    surname: string;

    @Column({ type: "varchar", length: 255, unique: true })
    username: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    picture: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Column({ type: "varchar", length: 255 })
    password: string;

    @Column({ type: "varchar", default: "user", length: 255 })
    role: string;

    @Column({ type: "boolean", default: false })
    isEmailVerified: boolean;

    @Column({ type: "boolean", default: true })
    enabled: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 8);
        }
    }
}