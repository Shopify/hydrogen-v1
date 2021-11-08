import {join, resolve} from 'path';

import {readFileSync} from 'fs-extra';
import glob from 'glob';

const ROOT_PATH = resolve(__dirname, '..');

const HEADER_START_REGEX = /^## /;
const CHANGELOG_INTRO = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).`;

readChangelogs().forEach(({packageChangelogPath, packageChangelog}) => {
  describe(`changelog consistency for ${packageChangelogPath}`, () => {
    it('begins with the "Keep a Changelog" intro section', () => {
      const actualIntro = packageChangelog.substring(0, CHANGELOG_INTRO.length);

      expect(actualIntro).toBe(CHANGELOG_INTRO);
    });

    it('contains only known headers', () => {
      const headerLines = packageChangelog
        .split('\n')
        .filter((line) => /^\s*#/.exec(line));
      const offendingHeaders = headerLines.filter(
        (headerLine) => !headerIsAllowed(headerLine)
      );

      expect(offendingHeaders).toStrictEqual([]);
    });

    it('has exactly 1 empty line before headings', () => {
      const notEnoughSpacingBeforeHeadings = /[^\n]+\n^#.*$/gm;

      expect(packageChangelog).not.toStrictEqual(
        expect.stringMatching(notEnoughSpacingBeforeHeadings)
      );
    });

    it('has exactly 1 empty line after headings', () => {
      const notEnoughSpacingAfterHeadings = /^#.*$\n[^\n]+/gm;

      expect(packageChangelog).not.toStrictEqual(
        expect.stringMatching(notEnoughSpacingAfterHeadings)
      );
    });

    it('contains an Unreleased header with content, or a commented out Unreleased header with no content', () => {
      // One of the following must be present
      // - An Unreleased header, that is immediatly preceded by a level 3 heading ("Changed" etc)
      // - An Unreleased header, that is immediatly preceded by a bullet ("- ...")
      // - A commented out Unreleased header, that is immediatly preceded by a level 2 heading (Version info)

      const unreleasedHeaderWithContent = /^## Unreleased\n\n- /gm;
      const unreleasedHeaderWithSubHeader = /^## Unreleased\n\n### /gm;
      const commentedUnreleasedHeaderWithNoContent =
        /^<!-- ## Unreleased -->\n\n## /gm;

      expect([
        unreleasedHeaderWithContent.test(packageChangelog) ||
          unreleasedHeaderWithSubHeader.test(packageChangelog),
        commentedUnreleasedHeaderWithNoContent.test(packageChangelog),
      ]).toContain(true);
    });

    it('does not contain duplicate headers', () => {
      const headerLines = packageChangelog
        .split('\n')
        .filter(
          (line) => HEADER_START_REGEX.exec(line) || /## Unreleased/.exec(line)
        )
        .sort();
      const uniqueHeaderLines = headerLines.filter(
        (element, index, array) => array.indexOf(element) === index
      );

      expect(headerLines).toStrictEqual(uniqueHeaderLines);
    });
  });
});

const allowedHeaders = [
  '# Changelog',
  '## Unreleased',
  /^## \d+\.\d+\.\d-\w+\.\d+ - \d\d\d\d-\d\d-\d\d$/, // -alpha.x releases
  /^## \d+\.\d+\.\d+ - \d\d\d\d-\d\d-\d\d$/,
  '### Fixed',
  '### Added',
  '### Changed',
  '### Deprecated',
  '### Removed',
  '### Security',
  /^####/,
];

function headerIsAllowed(headerLine) {
  return allowedHeaders.some((allowedHeader) => {
    if (allowedHeader instanceof RegExp) {
      return allowedHeader.test(headerLine);
    } else {
      return allowedHeader === headerLine;
    }
  });
}

function readChangelogs() {
  const packagesPath = join(ROOT_PATH, 'packages');

  return glob
    .sync(join(packagesPath, '*/'))
    .filter(hasPackageJSON)
    .filter(hasChangelog)
    .map((packageDir) => {
      const packageChangelogPath = join(packageDir, 'CHANGELOG.md');
      const packageChangelog = safeReadSync(packageChangelogPath, {
        encoding: 'utf8',
      }).toString('utf-8');

      return {
        packageDir,
        packageChangelogPath,
        packageChangelog,
      };
    });
}

function safeReadSync(path, options) {
  try {
    return readFileSync(path, options);
  } catch {
    return '';
  }
}

function hasChangelog(packageDir) {
  const changelogJSONPath = join(packageDir, 'CHANGELOG.md');
  const changelog = safeReadSync(changelogJSONPath, {
    encoding: 'utf8',
  });

  return changelog.length > 0;
}

function hasPackageJSON(packageDir) {
  const packageJSONPath = join(packageDir, 'package.json');
  const packageJSON = safeReadSync(packageJSONPath, {
    encoding: 'utf8',
  });

  return packageJSON.length > 0;
}
