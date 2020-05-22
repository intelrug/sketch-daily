/* eslint-disable prefer-promise-reject-errors,no-console */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

// folder with all blocks
const BLOCKS_DIR = path.join(__dirname, '../components');

// //////////////////////////////////////////////////////////////////////////////////////////////////

// default content for files in new block
const fileSources = {
  vue:
    '<template>\n' +
    '  <!-- begin .{blockName}-->\n' +
    '  <div class="{blockName}" />\n' +
    '  <!-- end .{blockName}-->\n' +
    '</template>\n\n' +
    '<script lang="ts">\n' +
    "import { Component, Vue } from 'nuxt-property-decorator';\n\n" +
    '@Component({\n' +
    "  name: 'b-{blockName}',\n" +
    '})\n' +
    'export default class {className} extends Vue {}\n' +
    '</script>\n\n' +
    '<style lang="stylus" src="./{blockName}.styl" />\n',
  styl: '.{blockName}\n\tdisplay block\n',
};

function clearAndUpper(text) {
  return text.replace(/-/, '').toUpperCase();
}

function toPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function validateBlockName(blockName) {
  return new Promise((resolve, reject) => {
    const isValid = /^(\d|\w|-)+$/.test(blockName);

    if (isValid) {
      resolve(isValid);
    } else {
      const errMsg = `ERR>>> An incorrect block name '${blockName}'\nERR>>> A block name must include letters, numbers & the minus symbol.`;
      reject(errMsg);
    }
  });
}

function directoryExist(blockPath, blockName) {
  return new Promise((resolve, reject) => {
    fs.stat(blockPath, (notExist) => {
      if (notExist) {
        resolve();
      } else {
        reject(`ERR>>> The block '${blockName}' already exists.`);
      }
    });
  });
}

function createDir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, (err) => {
      if (err) {
        reject(`ERR>>> Failed to create a folder '${dirPath}'`);
      } else {
        resolve();
      }
    });
  });
}

function createFiles(blocksPath, blockName) {
  const promises = [];
  Object.keys(fileSources).forEach((ext) => {
    const fileSource = fileSources[ext]
      .replace(/{blockName}/g, blockName)
      .replace(/{className}/g, toPascalCase(blockName));
    const filename = `${blockName}.${ext}`;
    const filePath = path.join(blocksPath, filename);

    promises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileSource, 'utf8', (err) => {
          if (err) {
            reject(`ERR>>> Failed to create a file '${filePath}'`);
          } else {
            resolve();
          }
        });
      }),
    );
  });

  return Promise.all(promises);
}

function getFiles(blockPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(blockPath, (err, files) => {
      if (err) {
        reject(`ERR>>> Failed to get a file list from a folder '${blockPath}'`);
      } else {
        resolve(files);
      }
    });
  });
}

function printErrorMessage(errText) {
  console.log(errText);
  rl.close();
}

// //////////////////////////////////////////////////////////////////////////

function initMakeBlock(candidateBlockName) {
  const blockNames = candidateBlockName.trim().split(/\s+/);

  const makeBlock = (blockName) => {
    const blockPath = path.join(BLOCKS_DIR, blockName);

    return validateBlockName(blockName)
      .then(() => directoryExist(blockPath, blockName))
      .then(() => createDir(blockPath))
      .then(() => createFiles(blockPath, blockName))
      .then(() => getFiles(blockPath))
      .then((files) => {
        const line = '-'.repeat(48 + blockName.length);
        console.log(line);
        console.log(
          `The block has just been created in 'components/${blockName}'`,
        );
        console.log(line);

        // Displays a list of files created
        files.forEach((file) => console.log(file));
      });
  };

  if (blockNames.length === 1) {
    return makeBlock(blockNames[0]);
  }

  const promises = blockNames.map((name) => makeBlock(name));
  return Promise.all(promises);
}

// //////////////////////////////////////////////////////////////////////////
//
// Start here
//

// Command line arguments
const blockNameFromCli = process.argv
  .slice(2)
  // join all arguments to one string (to simplify the capture user input errors)
  .join(' ');

// If the user pass the name of the block in the command-line options
// that create a block. Otherwise - activates interactive mode
if (blockNameFromCli !== '') {
  initMakeBlock(blockNameFromCli)
    .then(() => rl.close())
    .catch(printErrorMessage);
} else {
  rl.setPrompt('Block(s) name: ');
  rl.prompt();
  rl.on('line', (line) => {
    initMakeBlock(line)
      .then(() => rl.close())
      .catch(printErrorMessage);
  });
}
