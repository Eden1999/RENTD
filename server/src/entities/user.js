import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id

    @Column()
    fullname

    @Column()
    isHost

    @Column()
    password
}