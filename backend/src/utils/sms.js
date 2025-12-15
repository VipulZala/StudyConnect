// src/utils/sms.js
const twilio = require('twilio');

// Initialize Twilio client
let twilioClient = null;

// Check if Twilio credentials are configured
const isTwilioConfigured = () => {
    return !!(
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER
    );
};

// Initialize Twilio client if credentials are available
if (isTwilioConfigured()) {
    try {
        twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        console.log('✓ Twilio SMS service initialized');
    } catch (err) {
        console.error('Failed to initialize Twilio:', err.message);
    }
}

/**
 * Send SMS using Twilio
 * @param {string} to - Recipient phone number (E.164 format, e.g., +919876543210)
 * @param {string} message - Message to send
 * @returns {Promise<object>} - Twilio message response or error
 */
async function sendSMS(to, message) {
    // If Twilio is not configured, log to console (development mode)
    if (!twilioClient) {
        console.log('⚠️  Twilio not configured. SMS would be sent to:', to);
        console.log('📱 Message:', message);
        return {
            success: false,
            mode: 'console',
            message: 'Twilio not configured - logged to console'
        };
    }

    try {
        const result = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });

        console.log(`✓ SMS sent to ${to}, SID: ${result.sid}`);
        return {
            success: true,
            mode: 'twilio',
            sid: result.sid,
            status: result.status
        };
    } catch (err) {
        console.error('Failed to send SMS via Twilio:', err.message);

        // Log the error details for debugging
        if (err.code) {
            console.error('Twilio Error Code:', err.code);
        }
        if (err.moreInfo) {
            console.error('More Info:', err.moreInfo);
        }

        return {
            success: false,
            mode: 'twilio',
            error: err.message,
            code: err.code
        };
    }
}

module.exports = {
    sendSMS,
    isTwilioConfigured
};
