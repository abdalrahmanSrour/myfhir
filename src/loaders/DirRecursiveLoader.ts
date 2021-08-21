import DirLoader from './DirLoader';

/**
 * Loads a directory and allow looping for files in the directory
 * recursively.
 */
export class DirRecursiveLoader extends DirLoader {
    /**
     * Loops over loaded dirents recursively searching for files.
     * Must call @method load before calling this method.
     * Return false in callback to stop the loop.
     *
     * @param callback (file: string) => boolean
     * @returns this
     */
    public forEachFile(callback: (file: string) => boolean | void): this {
        this.forEach((dirent) => {
            if (dirent.isDirectory()) {
                let cont = false;
                const dirRec = new DirRecursiveLoader(`${this.dirPath}/${dirent.name}`);
                dirRec.load().forEachFile((file) => {
                    cont = callback(file) !== false;
                    return cont;
                });
            } else if (dirent.isFile()) {
                return callback(`${this.dirPath}/${dirent.name}`);
            } else {
                // skip
                return true;
            }
        });

        return this;
    }
}
