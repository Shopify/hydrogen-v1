import fs from 'fs';

function lint() {
  // Get the list of ignored packages from .changeset/config.json
  const config = JSON.parse(fs.readFileSync('.changeset/config.json', 'utf8'));
  const ignoredPackages = config.ignore;

  // Iterate through all the .md files in the .changeset directory
  var changesetFiles = fs.readdirSync('.changeset');
  changesetFiles.forEach(function (file) {
    if (file.indexOf('.md') < 0) return;

    var filePath = '.changeset/' + file;
    var fileContents = fs.readFileSync(filePath, 'utf8');

    // Check to see if any of the ignored packages exist in the frontmatter
    const frontmatter = fileContents.match(/^---\n([\s\S]*?)\n---/m);
    if (!frontmatter) return;

    let foundPackage;

    /**
     * We have to manually lint for this due to an issue with changesets:
     * @see https://github.com/changesets/changesets/issues/436
     */
    if (
      (foundPackage = ignoredPackages.find((ignoredPackage) =>
        frontmatter[1].includes(ignoredPackage)
      ))
    ) {
      throw new Error(
        `The changeset ${filePath} contains an ignored package: ${foundPackage}. ` +
          `Please remove it from the changeset. If it is the only package in the changeset, ` +
          `remove the changeset entirely.`
      );
    }

    console.log(`✅ No ignored packages found in changeset ${filePath}.`);

    /**
     * Ensure the first line of the changeset is NOT a markdown header:
     */
    const fileContentsWithoutFrontmatter = fileContents
      .replace(/^---\n([\s\S]*?)\n---/m, '')
      .trim();

    if (fileContentsWithoutFrontmatter.startsWith('#')) {
      throw new Error(
        `The first line of changeset ${filePath} begins with a header: \n\n${
          fileContentsWithoutFrontmatter.split('\n')[0]
        }\n\n` +
          `Changesets must begin with plain text. Please replace the header in the first line with a plain string. ` +
          `You may use markdown headers later in the body if desired.`
      );
    }

    console.log(
      `✅ First line begins with plain text in changeset ${filePath}.`
    );
  });
}

try {
  lint();
  console.log(`✅ No changeset issues detected.`);
} catch (e) {
  console.error(`❌ ${e.message}`);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
