/**
 * Rule structure that is used by @class `CommandArgsParser`
 */
export default interface CommandArgRule {
    /**
     * The argument flag such as `flag`, it will be converted as `--flag`
     */
    flag: string;

    /**
     * The short one character representation of this flag, could be `f` and will be converted as `-f`
     */
    flagShort?: string;

    /**
     * The value name if there is a value that can be passed to this flag.
     * The value will be converted to @type `string`
     */
    valueName?: string;

    /**
     * Description to be used in the `-h` or `--help` arg.
     */
    description?: string;

    /**
     * Default value if needed.
     */
    defaultValue?: string | boolean;
}
