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

async function enquire (copy: string):Promise<boolean> {
  const { value } = await Enquirer.prompt({
    type: 'select',
    name: 'value',
    message: copy,
    choices: ['yep', 'nope']
  });
  return value === 'yep';
}

function say (message: string) {
  console.log(message);
}

async function askQuestion (node): Promise<void> {
  for await (const question of node.children) {
    if (question.attribute === `${options.decision}`.toLowerCase()) {
      return say(`\nI think the answer is "${question.value}"`);
    }
    const result = await enquire(`Is the ${question.attribute} "${question.value}"?`);
    if (result) {
      return askQuestion(question);
    }
  }
  return say('I dont know...');
}

askQuestion(tree).then(() => {
  process.exit(0);
}).catch(error => {
  console.error(error);
  process.exit(1);
});

// TODO use enquirer to ask tree questions; recurse till no children ( ie, decided )
