const fs = require('fs');
const { exec } = require('child_process');

const languages = {
  'python': { command: 'python3', extension: '.py' },
  'javascript': { command: 'node', extension: '.js' },
  'java': { command: 'java', extension: '.java' }
};

function compileLangauge(language, code) {
    try {
  return new Promise((resolve, reject) => {
    const languageConfig = languages[language];
    if (!languageConfig) {
      reject(`Language not supported`);
      return;
    }
    const fileName = `${generateRandomFileName()}${languageConfig.extension}`;
    fs.writeFileSync(fileName, code);
    const command = language === 'java' ? `javac ${fileName} && java ${fileName}` : `${languageConfig.command} ${fileName}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve([error, true]);
      } else {
        resolve([stdout, false]);
      }
      fs.unlinkSync(fileName);
    });
  });
} catch(err){
    console.log('compiler failed');
 }
}

function generateRandomFileName() {
  return Math.random().toString(36).substring(2);
}
module.exports = compileLangauge;