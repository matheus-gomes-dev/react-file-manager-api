const csv = require('csv-parser');
const fs = require('fs');

module.exports = {
  parseCSVFile: (path) => {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          fs.unlink(path);
          resolve(results);
        })
        .on('error', () => reject());
    });
  }
}