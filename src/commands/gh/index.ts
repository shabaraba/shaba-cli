import { Command } from 'commander';
import { repoInit } from './repo-init';

export const ghCommand = new Command('gh')
  .description('GitHub related commands');

ghCommand.addCommand(repoInit);
