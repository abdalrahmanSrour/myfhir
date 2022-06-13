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
        let parsed = parser.parse(['1', '2']);
        expect(parsed.file).toBeUndefined();
        parsed = parser.parse(['1', '2', '--file']);
        expect(parsed.file).toEqual(true);
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
        const parser = new CommandArgsParser<{ file?: string }>(rules, {}, 'test', '0.1.0', 'Test App');
        expect(parser.command.name()).toEqual('test');
        expect(parser.command.helpInformation()).toEqual(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version           output the version number\n  -f, --file <file-name>  The file path (default: "./file")\n  -h, --help              display help for command\n',
        );
        let parsed = parser.parse(['1', '2']);
        expect(parsed.file).toEqual('./file');
        parsed = parser.parse(['1', '2', '--file', 'test']);
        expect(parsed.file).toEqual('test');
        parsed = parser.parse(['1', '2', '-f', 'short']);
        expect(parsed.file).toEqual('short');
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
        let parsed = parser.parse(['1', '2']);
        expect(parsed.file).toEqual('./file');
        expect(parsed.enable).toBeUndefined();
        parsed = parser.parse(['1', '2', '--file', 'test']);
        expect(parsed.file).toEqual('test');
        expect(parsed.enable).toBeUndefined();
        parsed = parser.parse(['1', '2', '-f', 'short']);
        expect(parsed.file).toEqual('short');
        expect(parsed.enable).toBeUndefined();
        parsed = parser.parse(['1', '2', '-f', 'short', '--enable']);
        expect(parsed.file).toEqual('short');
        expect(parsed.enable).toEqual(true);
        parsed = parser.parse(['1', '2', '-e', '--file', 'long']);
        expect(parsed.file).toEqual('long');
        expect(parsed.enable).toEqual(true);
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
        let parsed = parser.parse(['1', '2']);
        expect(parsed.file).toEqual('./file');
        expect(parsed.enable).toEqual(false);
        parsed = parser.parse(['1', '2', '-e']);
        expect(parsed.file).toEqual('./file');
        expect(parsed.enable).toEqual(true);
        parsed = parser.parse(['1', '2', '--file', 'test']);
        expect(parsed.file).toEqual('test');
        expect(parsed.enable).toEqual(true);
        parsed = parser.parse(['1', '2', '-f', 'short']);
        expect(parsed.file).toEqual('short');
        expect(parsed.enable).toEqual(true);
        parsed = parser.parse(['1', '2', '-f', 'short', '--enable']);
        expect(parsed.file).toEqual('short');
        expect(parsed.enable).toEqual(true);
        parsed = parser.parse(['1', '2', '-e', '--file', 'long']);
        expect(parsed.file).toEqual('long');
        expect(parsed.enable).toEqual(true);
    });
});
