import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';


@Entity()
export class Token extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bearer: string;

    @Column()
    expiresIn: number;

    @Column({default: true})
    invalid: boolean;
}
