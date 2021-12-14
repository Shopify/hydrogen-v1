import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid';
import markdownTable from 'markdown-table';

import type {
  LocalReference,
  RemoteComponent,
  Type,
  PropertySignature,
  Tag,
  FrontMatter,
} from '../types';

import {Module} from '@shopify/docs-tools';

export function isComponentName(name?: string) {
  if (!name) {
    return false;
  }
  return name.charAt(0) === name.charAt(0).toUpperCase();
}

export function isHookName(name?: string) {
  if (!name) {
    return false;
  }
  return name.startsWith('use');
}

export interface Node {
  value: RemoteComponent | Type | LocalReference;
  module: Module | undefined;
}

export type Visibility = 'hidden' | 'postUnite' | 'visible';

export function renderYamlFrontMatter(frontMatter: FrontMatter) {
  let matter = '---\n';

  (Object.keys(frontMatter) as (keyof FrontMatter)[]).forEach((key) => {
    matter += `${key}: ${frontMatter[key]}\n`;
  });

  matter += '---\n\n';
  return matter;
}

export function findUuid(file: string) {
  let uuid = uuidv4();
  if (fs.existsSync(file)) {
    const uuidMatch = fs
      .readFileSync(file, 'utf8')
      .match(
        /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g
      );

    if (uuidMatch != null) {
      uuid = uuidMatch[0];
    }
  }

  return uuid;
}

export function dedupe<T>(array: T[]) {
  return [...new Set(array)];
}

export function heading(text: string, level = 2) {
  return `<a name="${text}"></a>\n\n${text.padStart(level, '#')} ${text}\n\n`;
}

export interface TableConfig {
  heading?: string;
  content?: string;
  properties: PropertySignature[];
  directory: string;
  additionalPropsTables?: string[];
  exports: Node[];
}

export function table({
  heading,
  content = '',
  properties,
  directory,
  additionalPropsTables = [],
  exports,
}: TableConfig) {
  const table = [];

  const propertiesHaveParameters =
    properties?.filter(({parameters}) => parameters).length > 0;
  if (propertiesHaveParameters) {
    table.push(['Type', 'Description']);
  } else {
    table.push(['Name', 'Type', 'Description']);
  }

  properties?.forEach(
    ({name: propName, optional, value, docs: propDocs, parameters}) => {
      if (parameters) {
        const thisParamType = paramsType(
          parameters,
          exports,
          directory,
          additionalPropsTables
        );
        const thisPropType = propType(
          value,
          exports,
          directory,
          additionalPropsTables
        );
        const type = `<code>(${thisParamType}): ${thisPropType}</code>`;
        const description = propDocs
          ? newLineToBr(strip(propDocs.content))
          : '';
        table.push([type, description]);
      } else {
        const name = `${propName}${optional ? '?' : ''}`;
        const type = `<code>${propType(
          value,
          exports,
          directory,
          additionalPropsTables
        )}</code>`;

        const content = propDocs ? strip(propDocs.content) : '';
        const tags = propDocs?.tags?.length
          ? propDocs.tags.map(stringifyTag).join('\n')
          : '';
        const description = newLineToBr(content + tags);

        table.push([name, type, description]);
      }
    }
  );

  return [
    heading,
    content,
    markdownTable(table, {
      stringLength: () => 3,
    }),
  ].join('');
}

function newLineToBr(string: string): string {
  return string.replace(/\n\n/g, '<br /><br />').replace(/\n/g, ' ');
}

function propType(
  value: any,
  exports: any[],
  dir: string,
  additionalPropsTables: string[]
): any {
  let params = '';
  if (value.params != null && value.params.length > 0) {
    params = `<<wbr>${value.params
      .map((param: any) => propType(param, exports, dir, additionalPropsTables))
      .join(', ')}<wbr>>`;
  }
  const PIPE = '&#124;';

  switch (value.kind) {
    case 'AnyType':
      return 'any';
    case 'NullType':
      return 'null';
    case 'UnknownType':
      return 'unknown';
    case 'VoidType':
      return 'void';
    case 'StringType':
      return 'string';
    case 'BooleanType':
      return 'boolean';
    case 'NeverKeyword':
      return 'never';
    case 'ArrayType':
      return `${propType(
        value.elements,
        exports,
        dir,
        additionalPropsTables
      )}[]`;
    case 'NumberType':
      return 'number';
    case 'Local':
      // eslint-disable-next-line no-case-declarations
      const local = exports.find(
        ({value: exportValue}: any) => exportValue.name === value.name
      );

      if (local == null) {
        console.warn(
          `Can’t resolve export type \`${value.name}\` in ${dir}. Maybe it’s not exported from the component index or imported from a remote package.`
        );

        return `${value.name}${params}`;
      }
      local.value.params = value.params;
    // return propType(local.value, exports, dir, additionalPropsTables);
    case 'InterfaceType':
      additionalPropsTables.push(
        table({
          heading: heading(value.name, 3),
          content: '',
          properties: value.properties,
          exports,
          directory: dir,
          additionalPropsTables,
        })
      );
      return `${anchorLink(value.name)}${params}`;
    case 'UnionType':
      return value.types
        .map((type: any) => {
          return propType(type, exports, dir, additionalPropsTables);
        })
        .join(` ${PIPE} `);
    case 'StringLiteralType':
      return `"${value.value}"`;
    case 'NumberLiteralType':
      return `${value.value}`;
    case 'BooleanLiteralType':
      return `${value.value}`;
    case 'FunctionType':
      return `(${paramsType(
        value.parameters,
        exports,
        dir,
        additionalPropsTables
      )}) => ${propType(
        value.returnType,
        exports,
        dir,
        additionalPropsTables
      )}`;
    case 'MappedType':
      return anchorLink(value.name);
    default:
      if (value.kind === 'UndocumentedType' && value.name === 'T') {
        return 'T';
      }
      return value.kind;
  }
}

function anchorLink(string: string): string {
  return `<a href="#${string.toLowerCase()}">${string}</a>`;
}

function sentenceCaseTagName(tagName: string) {
  const input = tagName.slice(1);
  const result = input.replace(/([A-Z])/g, ' $1').toLowerCase();
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function stringifyTag(tag: Tag) {
  let string = sentenceCaseTagName(tag.name);
  if (tag.content) {
    string += `: <code>${tag.content}</code>`;
  }
  return string;
}

function escapeHTML(html: string) {
  const chars: {[key: string]: string} = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&#34;',
  };
  return html.replace(/[&<>"]/g, (tag: string) => chars[tag] || tag);
}

export function strip(content: string) {
  return escapeHTML(
    content
      .replace('/**', '')
      .replace('*/', '')
      .replace(/\n \* /g, '\n')
      .replace(/\n \*/g, '\n')
      .replace(/\n\n \* /g, '\n\n')
  );
}

/**
 * extract first sentence (line or up to '.') for yaml description field
 */
export function firstSentence(content: string) {
  if (content === '') {
    return content;
  }
  const lines = content.split('\n').join(' ').split('. ');

  let firstSentence = lines.length ? lines[0] : content;

  if (firstSentence[firstSentence.length - 1] !== '.') {
    firstSentence += '.';
  }

  return firstSentence.replace('\n', ' ');
}

function paramsType(
  params: any[],
  exports: any[],
  dir: string,
  additionalPropsTables: string[]
) {
  return params
    .map(
      (param) =>
        `${param.name}: ${propType(
          param.type,
          exports,
          dir,
          additionalPropsTables
        )}`
    )
    .join(', ');
}

export function mkdir(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {recursive: true});
  }
}
