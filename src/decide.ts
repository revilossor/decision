#!/usr/bin/env node

import { DecisionTree } from './decision-tree';
import getopt from 'node-getopt';
import Enquirer from 'enquirer';

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

async function enquire (copy: string, values: string[]):Promise<boolean> {
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

async function askQuestion (node): Promise<void> {
  const attribute = node.children[0].attribute;
  if (attribute === `${options.decision}`.toLowerCase()) {
    return say(`I think the answer is "${node.children[0].value.join(' or ')}"`);
  }
  const values = node.children.map(({ value }) => value);
  const result = await enquire(
    `How would you describe the "${attribute}"?`,
    [...values, 'none of the above']
  );
  const next = node.children.find(child => child.value === result);
  if (next) {
    return askQuestion(next);
  }
  return say('I dont know...');
}

askQuestion(tree).then(() => {
  process.exit(0);
}).catch(error => {
  console.error(error);
  process.exit(1);
});
