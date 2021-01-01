import * as nodemailer from 'nodemailer';
import * as config from 'config';
import {getRegistrationEmailHtml} from './registration-email';
import {Base64} from 'js-base64';
import {Logger} from '@nestjs/common';

const emailConfig = config.get('emailConfig');

export const sendRegistrationEmail = async (email: string, activationCode: string, link?: string, subject?: string): Promise<boolean> => {
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
            subject: subject || 'Active Citizen ✔',
            html: getRegistrationEmailHtml(Base64.encode(email), Base64.encode(activationCode), link)
        });

        return true;

    } catch (e) {
        new Logger().error(e);
        return false;
    }

};

