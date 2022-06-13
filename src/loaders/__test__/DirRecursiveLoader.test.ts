import DirRecursiveLoader from '../DirRecursiveLoader';

describe('Test DirRecursiveLoader', () => {
    it('Test One Subfile', () => {
        const dirRecursiveLoader = new DirRecursiveLoader(`${__dirname}/FoldersAndFiles`);
        dirRecursiveLoader.load();
        expect(dirRecursiveLoader.dirents.length).toEqual(2);

        dirRecursiveLoader.forEach((dirent, index) => {
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

        dirRecursiveLoader.forEachFile((file) => {
            expect([
                `${__dirname}/FoldersAndFiles/file1`,
                `${__dirname}/FoldersAndFiles/folder1/file2`,
            ]).toContain(file);
        });
    });

    it('Test Three Level SubFolder', () => {
        const dirRecursiveLoader = new DirRecursiveLoader(`${__dirname}/ThreeLevels`);
        dirRecursiveLoader.load();
        expect(dirRecursiveLoader.dirents.length).toEqual(2);

        dirRecursiveLoader.forEachFile((file) => {
            expect([
                `${__dirname}/ThreeLevels/fileLevel0`,
                `${__dirname}/ThreeLevels/Level1/fileLevel1`,
                `${__dirname}/ThreeLevels/Level1/Level2/fileLevel2`,
                `${__dirname}/ThreeLevels/Level1/Level2/Level3/fileLevel3`,
            ]).toContain(file);
        });
    });
});
