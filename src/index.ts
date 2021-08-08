#!/usr/bin/env node

import chalk from 'chalk';
import { clear } from 'console';
import path from 'path';
import { Command } from 'commander';
import figlet from 'figlet';

clear();
console.log(
    chalk.red(
        figlet.textSync('myFHIR-cli', { horizontalLayout: 'full' })
    )
);

const program = new Command();

program
    .version('0.1.0')
    .description("Generate mySQL schema from FHIR resources definitions")
    // .option('-p, --peppers', 'Add peppers')
    // .option('-P, --pineapple', 'Add pineapple')
    // .option('-b, --bbq', 'Add bbq sauce')
    .option('-f, --folder <path>', 'Definition folder path')
    // .option('-C, --no-cheese', 'You do not want any cheese')
    .parse(process.argv);

const options = program.opts();

console.log(options);