const child = require('child_process');
const fs = require('fs');

const FILE_NAME = 'git-version.json';

const SHA = child.execSync('git rev-parse HEAD').toString().trim();
const shortSHA = child.execSync('git rev-parse --short HEAD').toString().trim();
const branch = child.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const author = child.execSync('git log -1 --pretty=format:\'%an\'').toString().trim();
const commitTime = child.execSync('git log -1 --pretty=format:\'%cd\'').toString().trim();
const commitMessage = child.execSync('git log -1 --pretty=%B').toString().trim();
const commitNumber = child.execSync('git rev-list --count HEAD').toString().trim();

const versionInfo = {
  SHA,
  shortSHA,
  branch,
  author,
  commitTime,
  commitMessage,
  commitNumber
};

const versionInfoJson = JSON.stringify(versionInfo, null, 2);

fs.writeFile(`./src/assets/${FILE_NAME}`, versionInfoJson, { flag: 'w' }, err => {
  if (!!err) {
      throw err;
  } else {
    console.log(`${FILE_NAME} created for ${shortSHA}!`);
  }
});
