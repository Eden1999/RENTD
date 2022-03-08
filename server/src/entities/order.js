import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { User } from "./user";
import { Workspace } from "./workspace";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id

    @ManyToOne(() => User, user => user.id)
    @Column()
    userId

    @ManyToOne(() => Workspace, workspace => workspace.id)
    @Column()
    workspaceId

    @Column()
    dateTime
}