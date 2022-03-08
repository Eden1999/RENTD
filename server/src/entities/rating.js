import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { User } from "./user";
import { Workspace } from "./workspace";

@Entity()
export class Rating {

    @PrimaryGeneratedColumn()
    id

    @ManyToOne(() => Workspace, workspace => workspace.id)
    @Column()
    workspaceId

    @ManyToOne(() => User, user => user.id)
    @Column()
    userId

    @Column()
    rating

    @Column()
    comment
}