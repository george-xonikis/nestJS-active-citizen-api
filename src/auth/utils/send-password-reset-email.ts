import * as nodemailer from 'nodemailer';
import * as config from 'config';
import {Base64} from 'js-base64';
import {Logger} from '@nestjs/common';
import {getPasswordResetEmailHtml} from './password-reset-email';

const emailConfig = config.get('emailConfig');

export const sendPasswordResetEmail = async (email: string, token: string, link?: string): Promise<boolean> => {
    try {
        const transporter = nodemailer.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            auth: {
                user: emailConfig.hostUser,
                pass: emailConfig.hostPassword,
            },
        });

        await transporter.sendMail({
            from: emailConfig.from,
            to: email,
            subject: 'Active Citizen - Reset Password',
            html: getPasswordResetEmailHtml(Base64.encode(token), Base64.encode(token), link)
        });

        return true;

    } catch (e) {
        new Logger().error(e);
        return false;
    }

};

