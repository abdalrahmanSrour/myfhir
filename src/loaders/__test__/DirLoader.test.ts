import DirLoader from '../DirLoader';

describe('DirLoader Tests', () => {
    it('Test none existing dir', () => {
        expect(() => {
            const dirLoader = new DirLoader(`${__dirname}/not-exists-dir`);
            dirLoader.load();
        }).toThrow('ENOENT: no such file or directory');
    });

    it('Test one file dir', () => {
        const dirLoader = new DirLoader(`${__dirname}/OneFile`);
        dirLoader.load();
        expect(dirLoader.dirents.length).toEqual(1);
        dirLoader.forEach((dirent) => {
            expect(dirent.isFile()).toEqual(true);
            expect(dirent.name).toEqual('.gitkeep');
        });
    });

    it('Test folders and files', () => {
        const dirLoader = new DirLoader(`${__dirname}/FoldersAndFiles`);
        dirLoader.load();
        expect(dirLoader.dirents.length).toEqual(2);

        dirLoader.forEach((dirent, index) => {
            if (index === 1) {
                expect(dirent.isFile()).toEqual(false);
                expect(dirent.isDirectory()).toEqual(true);
                expect(dirent.name).toEqual('folder1');
            } else if (index === 0) {
                expect(dirent.isFile()).toEqual(true);
                expect(dirent.isDirectory()).toEqual(false);
                expect(dirent.name).toEqual('file1');
            }
        });
    });

    it('Test folders and files, break forEach', () => {
        const dirLoader = new DirLoader(`${__dirname}/FoldersAndFiles`);
        dirLoader.load();
        expect(dirLoader.dirents.length).toEqual(2);

        dirLoader.forEach((dirent, index) => {
            expect(dirent.isFile()).toEqual(true);
            expect(dirent.isDirectory()).toEqual(false);
            expect(dirent.name).toEqual('file1');
            expect(index).toEqual(0);
            return false;
        });
    });

    it('Test ASCII encoding', () => {
        const dirLoader = new DirLoader(`${__dirname}/OneFile`, 'ascii');
        dirLoader.load();
        expect(dirLoader.dirents.length).toEqual(1);
        dirLoader.forEach((dirent) => {
            expect(dirent.isFile()).toEqual(true);
            expect(dirent.name).toEqual('.gitkeep');
        });
    });
});
