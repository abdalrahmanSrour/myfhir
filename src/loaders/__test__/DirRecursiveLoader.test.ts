import DirRecursiveLoader from '../DirRecursiveLoader';
import { expect } from 'chai';

describe('Test DirRecursiveLoader', () => {
    it('Test One Subfile', () => {
        const dirRecursiveLoader = new DirRecursiveLoader(`${__dirname}/FoldersAndFiles`);
        dirRecursiveLoader.load();
        expect(dirRecursiveLoader.dirents.length, 'Dirents length').to.equal(2);

        dirRecursiveLoader.forEach((dirent, index) => {
            if (index === 1) {
                expect(dirent.isFile()).to.equal(false);
                expect(dirent.isDirectory()).to.equal(true);
                expect(dirent.name).to.equal('folder1');
            } else if (index === 0) {
                expect(dirent.isFile()).to.equal(true);
                expect(dirent.isDirectory()).to.equal(false);
                expect(dirent.name).to.equal('file1');
            }
        });

        dirRecursiveLoader.forEachFile((file) => {
            expect(file).to.be.oneOf([
                `${__dirname}/FoldersAndFiles/file1`,
                `${__dirname}/FoldersAndFiles/folder1/file2`,
            ]);
        });
    });

    it('Test Three Level SubFolder', () => {
        const dirRecursiveLoader = new DirRecursiveLoader(`${__dirname}/ThreeLevels`);
        dirRecursiveLoader.load();
        expect(dirRecursiveLoader.dirents.length, 'Dirents length').to.equal(2);

        dirRecursiveLoader.forEachFile((file) => {
            expect(file).to.be.oneOf([
                `${__dirname}/ThreeLevels/fileLevel0`,
                `${__dirname}/ThreeLevels/Level1/fileLevel1`,
                `${__dirname}/ThreeLevels/Level1/Level2/fileLevel2`,
                `${__dirname}/ThreeLevels/Level1/Level2/Level3/fileLevel3`,
            ]);
        });
    });
});
