/**
 * A script to be ran in a `version` hook that will package update and update
 * CHANGELOG.md headings accordingly.
 *
 * - "Unreleased" headings will be commented out and replaced with a new heading containing the new version of the package
 *   and add a new heading for new version of the package.
 * - Commented-out "Unreleased" headings will cause a new
 *   heading containing the new version of the dependency, and will note that the change
 *   is due to a transitive dependency update
 *
 * Important: Add this as the `version` script in your root package.json file. This
 * will cause it to run as part of the version release hooks as part of
 * `lerna version`. The `version` hook runs after version keys in package.json
 * files have been updated but before the changes are comitted, whiich allows
 * this script to update CHANGELOG.md files with versions that match those that
 * you selected when choosing what packages to update.
 */

// @type-check

const path = require('path');
const {execSync} = require('child_process');
const {readFileSync, writeFileSync} = require('fs');

const ROOT_PATH = path.resolve(__dirname, '..');

const modifiedPackageJsons = execSync(`git diff --name-only`, {stdio: ['pipe']})
  .toString()
  .trim()
  .split('\n')
  .filter((filename) => filename.endsWith('package.json'));

const packageLocations = JSON.parse(
  execSync(`yarn run --silent lerna changed --json`, {stdio: ['pipe']})
)
  .map(({location}) => location)
  .filter((location) =>
    modifiedPackageJsons.includes(
      path.relative(ROOT_PATH, path.join(location, 'package.json'))
    )
  );

const updatedChangelogs = packageLocations
  .map((location) => updateChangelogForPackage(location))
  .filter((changelog) => changelog !== '');

if (updatedChangelogs.length > 0) {
  const changelogsForGit = updatedChangelogs
    .map((changelogPath) => JSON.stringify(changelogPath))
    .join(' ');

  execSync(`git add ${changelogsForGit}`);
}

/**
 * @param {string} packageLocation
 */
function updateChangelogForPackage(packageLocation) {
  const packageJsonPath = path.join(packageLocation, 'package.json');
  const changelogPath = path.join(packageLocation, 'CHANGELOG.md');
  const relativeChangelogPath = path.relative(ROOT_PATH, changelogPath);

  const newVersion = JSON.parse(readFileSync(packageJsonPath)).version;
  const changelogContent = readFileSync(changelogPath, 'utf8');

  if (changelogContent.includes(`\n## ${newVersion}`)) {
    console.log(
      `- ${relativeChangelogPath}: Skipping as ${newVersion} header is already present`
    );
    return '';
  }

  if (changelogContent.includes('\n## Unreleased\n')) {
    console.log(
      `- ${relativeChangelogPath}: Replacing Unreleased header with ${newVersion} header`
    );

    const newContent = changelogContent.replace(
      '\n## Unreleased\n',
      `\n<!-- ## Unreleased -->\n\n${headingFormat(newVersion)}\n`
    );
    writeFileSync(changelogPath, newContent);
    return changelogPath;
  }

  if (changelogContent.includes('\n<!-- ## Unreleased -->\n')) {
    console.log(`- ${relativeChangelogPath}: Adding ${newVersion} header`);

    const newContent = changelogContent.replace(
      '\n<!-- ## Unreleased -->\n',
      `\n<!-- ## Unreleased -->\n\n${headingFormat(
        newVersion
      )}\n\n- No updates. Transitive dependency bump.\n`
    );
    writeFileSync(changelogPath, newContent);
    return changelogPath;
  }

  console.warn(
    `- ${relativeChangelogPath}: Skipping as no commented, or uncommented 'Unreleased' header was found`
  );

  return '';
}

/**
 * @param {string} version
 */
function headingFormat(version) {
  // Date based on iso8601 - YYYY-MM-DD format
  const isoDate = new Date().toISOString().split('T')[0];
  return `## ${version} - ${isoDate}`;
}
