import { Command } from 'commander';
import CommandArgRule from './CommandArgRule';

/**
 * Parse command line arguments and hold arguments in @property `commandArgs`.
 *
 * Use @method parse to parse commnad line argv
 */
export default class CommandArgsParser<T extends { [key: string]: string | boolean }> {
    private _command: Command;
    private _commandArgs: T;
    private _rules: CommandArgRule[];

    /**
     * Command intance
     */
    public get command(): Command {
        return this._command;
    }

    /**
     * Parsed command arguments of type T
     */
    public get commandArgs(): T {
        return this._commandArgs;
    }

    /**
     * Command rules list
     */
    public get rules(): CommandArgRule[] {
        return this._rules;
    }

    constructor(appVersion: string, appDescription: string, defaultArgs: T, rules: CommandArgRule[]) {
        this._commandArgs = defaultArgs;
        this._rules = rules;

        this._command = new Command();
        this.command.version(appVersion).description(appDescription);

        this.addRules();
    }

    /**
     * Add rules to command from @property rules
     */
    private addRules(): void {
        for (const rule of this.rules) {
            let flags = '';
            if (rule.flagShort) {
                flags = `-${rule.flagShort}, `;
            }

            flags += `--${rule.flag}`;

            if (rule.valueName) {
                flags += ` <${rule.valueName}>`;
            }

            this.command.option(flags, rule.description, rule.defaultValue);
        }
    }

    /**
     * Parse given argv and return the parsed options as @type T
     *
     * @param argv string[]
     * @returns T
     */
    public parse(argv: string[]): T {
        this.command.parse(argv);
        const opts = this.command.opts<T>();
        this._commandArgs = {
            ...opts,
        };

        return this._commandArgs;
    }
}
