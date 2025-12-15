const fs = require('fs');
try {
    const content = fs.readFileSync('server_log.txt', 'ucs2');
    fs.writeFileSync('server_log_utf8.txt', content, 'utf8');
    console.log('Conversion done');
} catch (e) {
    console.error(e);
}
