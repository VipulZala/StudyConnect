console.log('=== MINIMAL SERVER TEST ===');
console.log('Node version:', process.version);

require('dotenv').config();
console.log('Environment loaded');

const express = require('express');
console.log('Express loaded');

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Minimal server works!');
});

app.listen(PORT, () => {
    console.log(`✅ Minimal server listening on port ${PORT}`);
    console.log('Server is running successfully!');
});
