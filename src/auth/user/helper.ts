import {User} from './user.entity';

export const extractUserProfile = (user: User): Partial<User> => {
    delete user.salt;
    delete user.username;
    delete user.password;
    delete user.activationCode;
    delete user.active;
    delete user.isAdmin;
    return user;
};
export const getActivationCode = (): string => {
    /** Generate a random 8 digits code */
    return Math.floor(Math.random() * Math.pow(10, 8)).toString();
};