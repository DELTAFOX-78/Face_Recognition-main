import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

/**
 * SMS Service for sending attendance notifications
 * Now using Twilio API (Free $15 trial - no credit card required)
 */

const SMS_PROVIDER = process.env.SMS_PROVIDER || 'twilio';

// Twilio credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Debug: Log environment variable status on module load
console.log('SMS Service Loaded:');
console.log('- SMS_PROVIDER:', SMS_PROVIDER);
console.log('- Twilio Account SID:', TWILIO_ACCOUNT_SID ? 'Configured' : 'Not configured');
console.log('- Twilio Auth Token:', TWILIO_AUTH_TOKEN ? 'Configured' : 'Not configured');
console.log('- Twilio Phone Number:', TWILIO_PHONE_NUMBER || 'Not configured');

/**
 * Validate mobile number format (10 digits)
 */
function validateMobileNumber(mobileNumber) {
    if (!mobileNumber) {
        return false;
    }
    return /^\d{10}$/.test(mobileNumber);
}

/**
 * Send SMS using Twilio
 */
async function sendTwilioSMS(mobileNumber, message) {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        console.warn('Twilio credentials not configured. Skipping SMS.');
        console.warn('Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env');
        return { success: false, error: 'Twilio credentials not configured' };
    }

    try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        // Add country code for India (+91)
        const phoneNumber = '+91' + mobileNumber;

        const result = await client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });

        console.log(`SMS sent successfully to ${mobileNumber}`);
        console.log('Twilio Message SID:', result.sid);
        return { success: true, data: result };
    } catch (error) {
        console.error(`Error sending SMS via Twilio:`, error.message);
        if (error.code) {
            console.error('Twilio Error Code:', error.code);
        }
        if (error.moreInfo) {
            console.error('More info:', error.moreInfo);
        }
        return { success: false, error: error.message };
    }
}

/**
 * Main function to send attendance SMS
 * @param {string} mobileNumber - 10-digit mobile number
 * @param {string} studentName - Name of the student
 * @param {string} subject - Subject name
 * @param {string} date - Date of attendance (YYYY-MM-DD)
 * @param {string} status - "Present" or "Absent"
 */
export async function sendAttendanceSMS(mobileNumber, studentName, subject, date, status) {
    // Validate mobile number
    if (!validateMobileNumber(mobileNumber)) {
        console.warn(`Invalid or missing mobile number for ${studentName}. Skipping SMS.`);
        return { success: false, error: 'Invalid mobile number' };
    }

    // Format date for better readability
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // Create message
    const message = `Hello ${studentName}, your attendance for ${subject} on ${formattedDate} has been marked as ${status.toUpperCase()}.`;

    console.log(`Sending SMS to ${mobileNumber}: ${message}`);

    // Send SMS via Twilio
    return await sendTwilioSMS(mobileNumber, message);
}

/**
 * Test function to verify SMS service is working
 */
export async function testSMS(mobileNumber) {
    if (!validateMobileNumber(mobileNumber)) {
        return { success: false, error: 'Invalid mobile number format. Must be 10 digits.' };
    }

    const testMessage = 'Test message from Attendance System. SMS integration is working!';
    return await sendTwilioSMS(mobileNumber, testMessage);
}

export default {
    sendAttendanceSMS,
    testSMS,
};
