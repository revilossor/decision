#!/usr/bin/env node

import { DecisionTree } from './decision-tree';
import getopt from 'node-getopt';
import Enquirer from 'enquirer';
import * as fs from 'fs';
import * as path from 'path';

const { options } = getopt.create([
  ['f', 'filepath=PATH', 'The path to the data set .csv'],
  ['d', 'decision=ATTRIBUTE', 'The attribute we are making a decision for', 'decision'],
  ['i', 'ignore=ATTRIBUTE,ATTRIBUTE,...', 'Attributes not to consider', '']
])
  .bindHelp()
  .parseSystem();

if (!options.filepath) {
  console.error('you must pass a path to a data .csv file (see --help)');
  process.exit(1);
}

const tree = DecisionTree.fromFilePath(
  options.filepath as string,
  {
    classAttribute: (options.decision as string),
    ignoredAttributes: (options.ignore as string).split(',')
  }
);

async function enquire (copy: string, values: string[]):Promise<string> {
  const { value } = await Enquirer.prompt({
    type: 'select',
    name: 'value',
    message: copy,
    choices: values
  });
  return value;
}

function say (message: string) {
  console.log(message);
}

async function describeRecord (): Promise<void> {
  say(`Okay, let me ask you some questions about the "${tree.params.classAttribute}"`);

  const record = [];
  const attributes = tree.data.attributes
    .filter(attribute => attribute !== tree.params.classAttribute)
    .reverse();

  while (attributes.length > 0) {
    const attribute = attributes.pop();
    const existingValues = tree.data.getDistinctValues(attribute);
    const result = await enquire(
      `How would you describe its "${attribute}"?`,
      existingValues
    );
    record.push(result);
  }

  const { thing } = await Enquirer.prompt({
    type: 'input',
    name: 'thing',
    message: 'What would you call it?'
  });

  say('Thanks, i\'ll remember that');

  const keyIndex = tree.data.attributes.indexOf(tree.params.classAttribute);
  record.splice(keyIndex, 0, thing);

  fs.appendFileSync(path.resolve(options.filepath as string), `${record}\n`);
}

async function askQuestion (node): Promise<void> {
  const attribute = node.children[0].attribute;
  if (attribute === `${options.decision}`.toLowerCase()) {
    return say(`I think the answer is "${node.children[0].value.join(' or ')}"`);
  }
  const values = node.children.map(({ value }) => value);
  let result;
  result = await enquire(
    `How would you describe the "${attribute}"?`,
    [...values, 'none of the above']
  );
  const next = node.children.find(child => child.value === result);
  if (next) {
    return askQuestion(next);
  }
  say('I dont know...');
  result = await enquire(
    'Can you describe it for me please?',
    ['Yes', 'No']
  );
  if (result === 'Yes') {
    return describeRecord();
  } else {
    say('Okay, no worries.');
  }
}

askQuestion(tree).then(() => {
  process.exit(0);
}).catch(error => {
  console.error(error);
  process.exit(1);
});
