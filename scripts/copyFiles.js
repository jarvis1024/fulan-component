/* eslint-disable no-console */
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const packagePath = process.cwd();
const { BUILD_PATH = 'build' } = process.env;
const sourcePath = path.join(packagePath, 'src');
const buildPath = path.join(packagePath, BUILD_PATH);

const copyPackageFile = () => {
  const packageFile = fs.readFileSync(path.resolve(packagePath, 'package.json'), 'utf8');
  const { scripts, devDependencies, 'lint-staged': lint, ...packageData } = JSON.parse(packageFile);

  // packageData.version = process.env.VERSION;
  fs.writeFileSync(
    path.resolve(buildPath, 'package.json'),
    JSON.stringify(packageData, null, 2),
    'utf8',
  );

  const styles = glob.sync('**/*.{less,css}', { cwd: sourcePath }) || [];
  styles.forEach(filename => {
    fs.copyFileSync(path.resolve(sourcePath, filename), path.resolve(buildPath, filename));
  });
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
