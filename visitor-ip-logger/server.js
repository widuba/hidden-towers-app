const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let ipList = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const cleanIP = ip.replace(/^.*:/, '');
  if (!ipList.includes(cleanIP)) {
    ipList.push(cleanIP);
    fs.appendFileSync('ips.txt', cleanIP + '\n');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ips', (req, res) => {
  res.send(`<h2>All Visitor IPs:</h2><pre>${ipList.join('\n')}</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
