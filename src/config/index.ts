import dotenv from 'dotenv';
import path from 'path';
import { email } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    jwt: {
        access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
        access_token_expires: process.env.ACCESS_TOKEN_EXPIRES as string,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,
        refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES as string,
        reset_pass_token_secret: process.env.RESET_PASS_TOKEN_SECRET as string,
        reset_pass_token_expires: process.env.RESET_PASS_TOKEN_EXPIRES as string,
    },
    salt_round: process.env.SALT_ROUND,
    emailSender: {
        smtp_user: process.env.SMTP_USER,
        smtp_pass: process.env.SMTP_PASS
    },
    reset_pass_link: process.env.RESET_PASS_LINK
}