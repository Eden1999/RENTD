import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Spacetype {

    @PrimaryGeneratedColumn()
    id

    @Column()
    name
}