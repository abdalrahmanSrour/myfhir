#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var console_1 = require("console");
var commander_1 = require("commander");
var figlet_1 = __importDefault(require("figlet"));
console_1.clear();
console.log(chalk_1.default.red(figlet_1.default.textSync('myFHIR-cli', { horizontalLayout: 'full' })));
var program = new commander_1.Command();
program
    .version('0.1.0')
    .description("Generate mySQL schema from FHIR resources definitions")
    // .option('-p, --peppers', 'Add peppers')
    // .option('-P, --pineapple', 'Add pineapple')
    // .option('-b, --bbq', 'Add bbq sauce')
    .option('-f, --folder <path>', 'Definition folder path')
    // .option('-C, --no-cheese', 'You do not want any cheese')
    .parse(process.argv);
var options = program.opts();
console.log(options);
