import CommandArgsParser from '../CommandArgsParser';
import CommandArgRule from '../CommandArgRule';

describe('CommandArgsParser Tests', () => {
    it('Parse empty rules', () => {
        const parser = new CommandArgsParser([], {}, 'test', '0.1.0', 'Test App');
        expect(parser.parse([])).toMatchObject({});
        expect(parser.command.helpInformation()).toEqual(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version  output the version number\n  -h, --help     display help for command\n',
        );
        expect(parser.command.name()).toEqual('test');
    });

    it('Parse one optional rule', () => {
        const rules: CommandArgRule[] = [
            {
                flag: 'file',
            },
        ];
        const parser = new CommandArgsParser<{ file?: boolean }>(rules, {}, 'test', '0.1.0', 'Test App');
        expect(parser.command.name()).toEqual('test');
        expect(parser.command.helpInformation()).toEqual(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version  output the version number\n  --file\n  -h, --help     display help for command\n',
        );
        parser.parse(['1', '2']);
        expect(parser.commandArgs.file).toBeUndefined();
        parser.parse(['1', '2', '--file']);
        expect(parser.commandArgs.file).toEqual(true);
    });

    it('Parse short flag', () => {
        const rules: CommandArgRule[] = [
            {
                flag: 'file',
                flagShort: 'f',
                defaultValue: './file',
                valueName: 'file-name',
                description: 'The file path',
            },
        ];
        const parser = new CommandArgsParser<{ file?: string }>(rules, undefined, 'test', '0.1.0', 'Test App');
        expect(parser.command.name()).toEqual('test');
        expect(parser.command.helpInformation()).toEqual(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version           output the version number\n  -f, --file <file-name>  The file path (default: "./file")\n  -h, --help              display help for command\n',
        );
        parser.parse(['1', '2']);
        expect(parser.commandArgs.file).toEqual('./file');
        parser.parse(['1', '2', '--file', 'test']);
        expect(parser.commandArgs.file).toEqual('test');
        parser.parse(['1', '2', '-f', 'short']);
        expect(parser.commandArgs.file).toEqual('short');
    });

    it('Parse multiple rules', () => {
        const rules: CommandArgRule[] = [
            {
                flag: 'file',
                flagShort: 'f',
                defaultValue: './file',
                valueName: 'file-name',
                description: 'The file path',
            },
            {
                flag: 'enable',
                flagShort: 'e',
                description: 'Enable something',
            },
        ];
        const parser = new CommandArgsParser<{ file?: string; enable?: boolean }>(
            rules,
            {},
            'test',
            '0.1.0',
            'Test App',
        );
        expect(parser.command.name()).toEqual('test');
        expect(parser.command.helpInformation()).toEqual(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version           output the version number\n  -f, --file <file-name>  The file path (default: "./file")\n  -e, --enable            Enable something\n  -h, --help              display help for command\n',
        );
        parser.parse(['1', '2']);
        expect(parser.commandArgs.file).toEqual('./file');
        expect(parser.commandArgs.enable).toBeUndefined();
        parser.parse(['1', '2', '--file', 'test']);
        expect(parser.commandArgs.file).toEqual('test');
        expect(parser.commandArgs.enable).toBeUndefined();
        parser.parse(['1', '2', '-f', 'short']);
        expect(parser.commandArgs.file).toEqual('short');
        expect(parser.commandArgs.enable).toBeUndefined();
        parser.parse(['1', '2', '-f', 'short', '--enable']);
        expect(parser.commandArgs.file).toEqual('short');
        expect(parser.commandArgs.enable).toEqual(true);
        parser.parse(['1', '2', '-e', '--file', 'long']);
        expect(parser.commandArgs.file).toEqual('long');
        expect(parser.commandArgs.enable).toEqual(true);
    });

    it('Parse default values', () => {
        const rules: CommandArgRule[] = [
            {
                flag: 'file',
                flagShort: 'f',
                valueName: 'file-name',
                description: 'The file path',
            },
            {
                flag: 'enable',
                flagShort: 'e',
                description: 'Enable something',
            },
        ];
        const parser = new CommandArgsParser<{ file?: string; enable?: boolean }>(
            rules,
            { enable: false, file: './file' },
            'test',
            '0.1.0',
            'Test App',
        );
        expect(parser.command.name()).toEqual('test');
        expect(parser.command.helpInformation()).toEqual(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version           output the version number\n  -f, --file <file-name>  The file path\n  -e, --enable            Enable something\n  -h, --help              display help for command\n',
        );

        parser.parse(['1', '2']);
        expect(parser.commandArgs.file).toEqual('./file');
        expect(parser.commandArgs.enable).toEqual(false);
        parser.parse(['1', '2', '-e']);
        expect(parser.commandArgs.file).toEqual('./file');
        expect(parser.commandArgs.enable).toEqual(true);
        parser.parse(['1', '2', '--file', 'test']);
        expect(parser.commandArgs.file).toEqual('test');
        expect(parser.commandArgs.enable).toEqual(true);
        parser.parse(['1', '2', '-f', 'short']);
        expect(parser.commandArgs.file).toEqual('short');
        expect(parser.commandArgs.enable).toEqual(true);
        parser.parse(['1', '2', '-f', 'short', '--enable']);
        expect(parser.commandArgs.file).toEqual('short');
        expect(parser.commandArgs.enable).toEqual(true);
        parser.parse(['1', '2', '-e', '--file', 'long']);
        expect(parser.commandArgs.file).toEqual('long');
        expect(parser.commandArgs.enable).toEqual(true);
    });
});
