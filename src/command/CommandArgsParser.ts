import { Command } from 'commander';
import CommandArgRule from './CommandArgRule';

/**
 * Parse command line arguments and hold arguments in @property `commandArgs`.
 *
 * Use @method parse to parse commnad line argv
 */
export default class CommandArgsParser<T extends { [key: string]: string | boolean }> {

    /**
     * Command intance
     *
     * @var Command
     */
    public get command(): Command {
        return this._command;
    }

    /**
     * Parsed command arguments of type T
     *
     * @var T
     */
    public get commandArgs(): T {
        return this._commandArgs;
    }

    /**
     * Command rules list
     *
     * @var CommandArgRule[]
     */
    public get rules(): CommandArgRule[] {
        return this._rules;
    }

    /**
     * Default arguments
     *
     * @var T
     */
    public get defaultArgs(): T {
        return this._defaultArgs;
    }

    /**
     * The main command
     */
    private _command: Command;

    /**
     * Command arguments
     */
    private _commandArgs: T;

    /**
     * List of command argument rules
     */
    private _rules: CommandArgRule[];

    /**
     * Default arguments
     */
    private _defaultArgs: T;

    constructor(
        rules: CommandArgRule[],
        defaultArgs?: T,
        appName?: string,
        appVersion?: string,
        appDescription?: string,
    ) {
        this._commandArgs = this._defaultArgs = defaultArgs ?? ({} as T);
        this._rules = rules;

        this._command = new Command();
        if (appVersion) {
            this.command.version(appVersion);
        }

        if (appDescription) {
            this.command.description(appDescription);
        }

        if (appName) {
            this.command.name(appName);
        }

        this.addRules();
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
            ...this.defaultArgs,
            ...opts,
        };

        return this._commandArgs;
    }

    /**
     * Add rules to command from @property rules
     *
     * @returns void
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
}
