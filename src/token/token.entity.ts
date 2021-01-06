import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';


@Entity()
export class Token extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    expiresIn: number;

    @Column({default: true})
    invalid: boolean;
}
