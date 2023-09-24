import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

@Entity("roles")
export class Role {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255 })
    slug: string;

    @Column({ type: "varchar", length: 255 })
    guard: string;

    @Column({ type: "text" })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
