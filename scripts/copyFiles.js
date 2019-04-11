/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const packagePath = process.cwd();
const { BUILD_PATH = 'build' } = process.env;
const buildPath = path.resolve(process.cwd(), BUILD_PATH);

const copyPackageFile = () => {
  const packageFile = fs.readFileSync(path.resolve(packagePath, 'package.json'), 'utf8');
  const { scripts, devDependencies, husky, ...packageData } = JSON.parse(packageFile);

  // packageData.version = process.env.VERSION;
  fs.writeFileSync(
    path.resolve(buildPath, 'package.json'),
    JSON.stringify(packageData, null, 2),
    'utf8',
  );
};

const run = async () => {
  try {
    copyPackageFile();
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
};

run();
