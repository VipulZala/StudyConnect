const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'require_log.txt');
fs.writeFileSync(logFile, 'Starting require check\n');

function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            walk(filepath);
        } else if (file.endsWith('.js') && !filepath.endsWith('server.js')) {
            try {
                log(`Requiring ${filepath}...`);
                require(filepath);
                log(`SUCCESS: ${filepath}`);
            } catch (err) {
                log(`ERROR: Failed to require ${filepath}`);
                log(err.stack);
            }
        }
    }
}

try {
    walk(path.join(__dirname, 'src'));
} catch (e) {
    log('Fatal error in walk: ' + e.message);
}
