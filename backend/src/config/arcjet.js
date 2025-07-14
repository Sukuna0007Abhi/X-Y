import arcjet, { tokenBucket, shield, detectBot } from '@arcjet/node';
import { ENV } from '../env.js';

// Initialize Arcjet with the security rules

export const aj = arcjet({
    key: ENV.ARCJET_KEY,
    characteristics: ['ip.src'],
    rules: [
        // shield protects your app from common attacks e.g. SQL injection, XSS, etc.
        shield({
            mode: 'LIVE'}),

            // BOT detection EXCEPT for search engines
        detectBot({
            mode: 'LIVE',
            allow: ['CATEGORY:SEARCH_ENGINE'],
        }),
        // RATE LIMITING WITH TOKEN BUCKET ALGORITHM 
        tokenBucket({
            mode: 'LIVE',
            refilRate: 20, // 20 requests per second
            interval: 10, //interval in seconds
            capacity: 30, // maximum tokens in the bucket
        }),
    ],

});
