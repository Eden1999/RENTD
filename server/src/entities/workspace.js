import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Spacetype, Spacetypes } from "./spacetype";
import { User } from "./user";

@Entity()
export class Workspace {

    @PrimaryGeneratedColumn()
    id

    @Column()
    name

    @ManyToOne(() => User, user => user.id)
    @Column()
    hostId

    @Column()
    location

    @Column()
    costPerHour

    @Column()
    capacity

    @Column()
    description

    @Column()
    wifi

    @Column()
    diabledAccess

    @ManyToOne(() => Spacetype, spacetype => spacetype.id)
    @Column()
    spaceTypeId

    @Column()
    smokeFriendly
}