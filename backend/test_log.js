const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'test_log_out.txt');

console.log('Writing to ' + logFile);
try {
    fs.writeFileSync(logFile, 'Hello world\n');
    console.log('Write success');
} catch (e) {
    console.error('Write failed', e);
}
