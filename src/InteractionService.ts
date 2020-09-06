import Enquirer from 'enquirer';

export class InteractionService {
  static say (message: string) {
    console.log(`\u001b[1m- ${message}\u001b[0m`);
  }

  static async textPrompt (copy: string): Promise<string> {
    const { thing } = await Enquirer.prompt({
      type: 'input',
      name: 'thing',
      message: copy
    });
    return thing;
  }

  static async selectPrompt (copy: string, values: string[]):Promise<string> {
    const { value } = await Enquirer.prompt({
      type: 'select',
      name: 'value',
      message: copy,
      choices: values
    });
    return value;
  }
}
