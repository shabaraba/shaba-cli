#!/usr/bin/env node
import { program } from 'commander';
import { ghCommand } from './commands/gh';

program
  .name('shaba-cli')
  .description('Personal CLI toolkit by shabaraba')
  .version('0.1.0');

program.addCommand(ghCommand);

program.parse();
