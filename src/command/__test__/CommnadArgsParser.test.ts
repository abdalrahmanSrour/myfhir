import { expect } from 'chai';
import CommandArgsParser from '../CommandArgsParser';
import CommandArgRule from '../CommandArgRule';

describe('CommandArgsParser Tests', () => {
    it('Parse empty rules', () => {
        const parser = new CommandArgsParser([], {}, 'test', '0.1.0', 'Test App');
        expect(parser.parse([])).to.be.empty;
        expect(parser.command.helpInformation()).to.equal(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version  output the version number\n  -h, --help     display help for command\n',
        );
        expect(parser.command.name()).to.equal('test');
    });

    it('Parse one optional rule', () => {
        const rules: CommandArgRule[] = [
            {
                flag: 'file',
            },
        ];
        const parser = new CommandArgsParser<{ file?: boolean }>(rules, {}, 'test', '0.1.0', 'Test App');
        expect(parser.command.name()).to.equal('test');
        expect(parser.command.helpInformation()).to.equal(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version  output the version number\n  --file\n  -h, --help     display help for command\n',
        );
        let parsed = parser.parse(['1', '2']);
        expect(parsed.file).to.be.undefined;
        parsed = parser.parse(['1', '2', '--file']);
        expect(parsed.file).to.be.true;
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
        expect(parser.command.name()).to.equal('test');
        expect(parser.command.helpInformation()).to.equal(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version           output the version number\n  -f, --file <file-name>  The file path (default: "./file")\n  -h, --help              display help for command\n',
        );
        let parsed = parser.parse(['1', '2']);
        expect(parsed.file).to.equal('./file');
        parsed = parser.parse(['1', '2', '--file', 'test']);
        expect(parsed.file).to.equal('test');
        parsed = parser.parse(['1', '2', '-f', 'short']);
        expect(parsed.file).to.equal('short');
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
        expect(parser.command.name()).to.equal('test');
        expect(parser.command.helpInformation()).to.equal(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version           output the version number\n  -f, --file <file-name>  The file path (default: "./file")\n  -e, --enable            Enable something\n  -h, --help              display help for command\n',
        );
        let parsed = parser.parse(['1', '2']);
        expect(parsed.file).to.equal('./file');
        expect(parsed.enable).to.be.undefined;
        parsed = parser.parse(['1', '2', '--file', 'test']);
        expect(parsed.file).to.equal('test');
        expect(parsed.enable).to.be.undefined;
        parsed = parser.parse(['1', '2', '-f', 'short']);
        expect(parsed.file).to.equal('short');
        expect(parsed.enable).to.be.undefined;
        parsed = parser.parse(['1', '2', '-f', 'short', '--enable']);
        expect(parsed.file).to.equal('short');
        expect(parsed.enable).to.be.true;
        parsed = parser.parse(['1', '2', '-e', '--file', 'long']);
        expect(parsed.file).to.equal('long');
        expect(parsed.enable).to.be.true;
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
        expect(parser.command.name()).to.equal('test');
        expect(parser.command.helpInformation()).to.equal(
            'Usage: test [options]\n\nTest App\n\nOptions:\n  -V, --version           output the version number\n  -f, --file <file-name>  The file path\n  -e, --enable            Enable something\n  -h, --help              display help for command\n',
        );
        let parsed = parser.parse(['1', '2']);
        expect(parsed.file).to.equal('./file');
        expect(parsed.enable).to.be.false;
        parsed = parser.parse(['1', '2', '-e']);
        expect(parsed.file).to.equal('./file');
        expect(parsed.enable).to.be.true;
        parsed = parser.parse(['1', '2', '--file', 'test']);
        expect(parsed.file).to.equal('test');
        expect(parsed.enable).to.be.true;
        parsed = parser.parse(['1', '2', '-f', 'short']);
        expect(parsed.file).to.equal('short');
        expect(parsed.enable).to.be.true;
        parsed = parser.parse(['1', '2', '-f', 'short', '--enable']);
        expect(parsed.file).to.equal('short');
        expect(parsed.enable).to.be.true;
        parsed = parser.parse(['1', '2', '-e', '--file', 'long']);
        expect(parsed.file).to.equal('long');
        expect(parsed.enable).to.be.true;
    });
});
