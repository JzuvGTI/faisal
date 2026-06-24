const fs = require('fs');
const https = require('https');
const path = require('path');

const fetchFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(filename, data);
        console.log(`Fetched ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error fetching ${filename}:`, err);
      reject(err);
    });
  });
};

(async () => {
  try {
    await fetchFile('https://raw.githubusercontent.com/Aghitsniii/SelamatUlangTahun/main/index.html', 'scratch_index.html');
    await fetchFile('https://raw.githubusercontent.com/Aghitsniii/SelamatUlangTahun/main/style.css', 'scratch_style.css');
    await fetchFile('https://raw.githubusercontent.com/Aghitsniii/SelamatUlangTahun/main/script.js', 'scratch_script.js');
    console.log('Done fetching files.');
  } catch (err) {
    console.error(err);
  }
})();
