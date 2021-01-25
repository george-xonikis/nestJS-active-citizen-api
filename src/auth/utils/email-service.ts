import {Logger} from '@nestjs/common';
import * as config from 'config';

const nodemailer = require('nodemailer');
const credentials = config.get('emailConfig');

export const sendEmail = async (email: string, html: string, subject?: string): Promise<boolean> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_ADDRESS || credentials.emailAddress,
                clientId: process.env.EMAIL_CLIENT_ID || credentials.clientID,
                clientSecret: process.env.EMAIL_CLIENT_SECRET || credentials.clientSecret,
                accessToken: process.env.EMAIL_ACCESS_TOKEN || credentials.accessToken,
                refreshToken: process.env.EMAIL_REFRESH_TOKEN || credentials.refreshToken,
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS || credentials.emailAddress,
            to: email,
            subject: subject || 'Active Citizen',
            html: html
        });

        return true;

    } catch (e) {
        new Logger().error('Email Error:', e);
        return false;
    }

};
