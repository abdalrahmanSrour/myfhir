import { expect } from 'chai';
import DirLoader from '../DirLoader';

describe('DirLoader Tests', () => {
    it('Test none existing dir', () => {
        expect(() => {
            const dirLoader = new DirLoader(`${__dirname}/not-exists-dir`);
            dirLoader.load();
        }).to.throw('ENOENT: no such file or directory');
    });

    it('Test one file dir', () => {
        const dirLoader = new DirLoader(`${__dirname}/OneFile`);
        dirLoader.load();
        expect(dirLoader.dirents.length, 'Dirents length').to.equal(1);
        dirLoader.forEach((dirent) => {
            expect(dirent.isFile()).to.equal(true);
            expect(dirent.name).to.equal('.gitkeep');
        });
    });

    it('Test folders and files', () => {
        const dirLoader = new DirLoader(`${__dirname}/FoldersAndFiles`);
        dirLoader.load();
        expect(dirLoader.dirents.length, 'Dirents length').to.equal(2);

        dirLoader.forEach((dirent, index) => {
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
    });

    it('Test folders and files, break forEach', () => {
        const dirLoader = new DirLoader(`${__dirname}/FoldersAndFiles`);
        dirLoader.load();
        expect(dirLoader.dirents.length, 'Dirents length').to.equal(2);

        dirLoader.forEach((dirent, index) => {
            expect(dirent.isFile()).to.equal(true);
            expect(dirent.isDirectory()).to.equal(false);
            expect(dirent.name).to.equal('file1');
            expect(index).to.equal(0);
            return false;
        });
    });
});
