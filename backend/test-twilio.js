// Test Twilio SMS functionality
require('dotenv').config();
const { sendSMS } = require('./src/utils/sms');

async function testTwilio() {
    console.log('Testing Twilio SMS...');
    console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID);
    console.log('Phone Number:', process.env.TWILIO_PHONE_NUMBER);
    console.log('Auth Token:', process.env.TWILIO_AUTH_TOKEN ? '***configured***' : 'NOT SET');

    const testPhone = '+919372657054'; // Your Twilio number
    const testMessage = 'Test message from StudyConnect. Your OTP is: 123456';

    console.log(`\nSending test SMS to ${testPhone}...`);
    const result = await sendSMS(testPhone, testMessage);

    console.log('\nResult:', JSON.stringify(result, null, 2));

    if (result.success) {
        console.log('\n✓ SUCCESS! SMS sent via Twilio');
    } else {
        console.log('\n✗ FAILED to send SMS');
        if (result.error) {
            console.log('Error:', result.error);
            console.log('Code:', result.code);
        }
    }
}

testTwilio().catch(console.error);
