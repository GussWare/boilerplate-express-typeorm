import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { ModuleModel } from './module.model';

@Entity('permissions')
export class PermissionModel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    slug: string;

    @Column({ type: 'enum', enum: ['GUARD_TYPE_API', 'GUARD_TYPE_WEB'] })
    guard: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'boolean', default: true })
    enabled: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
