import fs from 'fs';

/**
 * Loads a directory and allow looping throw its items
 */
export default class DirLoader {
    /**
     * Directory path
     *
     * @var fs.PathLike
     */
    private _dirPath: fs.PathLike;

    /**
     * Holds loaded dirents
     *
     * @var fs.Dirent[]
     */
    private _dirents: fs.Dirent[];

    /**
     * Encoding type to read files
     *
     * @var BufferEncoding
     */
    private _encoding: BufferEncoding;

    /**
     * Return directory path
     *
     * @var fs.PathLike
     */
    public get dirPath(): fs.PathLike {
        return this._dirPath;
    }

    /**
     * Returns loaded dirents
     *
     * @var fs.Dirent[]
     */
    public get dirents(): fs.Dirent[] {
        return this._dirents;
    }

    /**
     * Returns encoding type
     *
     * @var BufferEncoding
     */
    public get encoding(): BufferEncoding {
        return this._encoding;
    }

    /**
     * Loads a directory and allow looping throw its items
     *
     * @param folderPath fs.PathLike
     */
    constructor(folderPath: fs.PathLike, encoding: BufferEncoding = 'utf8') {
        this._dirPath = folderPath;
        this._dirents = [];
        this._encoding = encoding;
    }

    /**
     * Loads the directory and store its items in @property dirents
     *
     * @returns this
     */
    public load(): this {
        this._dirents = fs.readdirSync(this.dirPath, {
            encoding: this.encoding,
            withFileTypes: true,
        });

        return this;
    }

    /**
     * Loops over loaded dirents, must call @method load before calling this method.
     * Return false in callback to stop the loop.
     *
     * @param callback (dirent: fs.Dirent, index: number, dirents: fs.Dirent[]) => boolean
     * @returns this
     */
    public forEach(callback: (dirent: fs.Dirent, index: number, dirents: fs.Dirent[]) => boolean | void): this {
        const dirents = this.dirents;
        for (let index = 0; index < dirents.length; index++) {
            const dirent = dirents[index];
            if (callback(dirent, index, dirents) === false) {
                // stop looping if callback returned false
                break;
            }
        }

        return this;
    }
}
