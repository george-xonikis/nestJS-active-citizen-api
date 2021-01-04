import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

enum sexEnum {
    Male,
    Female
}

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column({unique: true, nullable: false})
    username: string;

    @Column({unique: true, nullable: false})
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column({nullable: false, default: false})
    active: boolean;

    @Column({nullable: true})
    age: number;

    @Column({nullable: true})
    bio: string;

    @Column({nullable: true})
    location: string;

    @Column({nullable: true, enum: sexEnum})
    sex: string;

    @Column({nullable: true})
    phone: string;

    @Column({nullable: true})
    languages: string;

    @Column({nullable: false, readonly: true})
    activationCode: string;

    @Column()
    isAdmin: boolean;

    // @Column() // Picture
    // avatar: string;

}

