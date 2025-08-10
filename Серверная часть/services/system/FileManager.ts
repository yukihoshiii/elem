import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import path from 'path';
import Config from '../../system/global/Config.js';
import { fileTypeFromBuffer } from 'file-type';
import { dbQueryM } from '../../system/global/DataBase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileManager {
    static async goToTemp(filePath: string) {
        const tempDir = path.join(__dirname, '../../storage/temp');
        await fs.mkdir(tempDir, { recursive: true });
        const tempFilePath = path.join(tempDir, path.basename(filePath));

        await fs.copyFile(filePath, tempFilePath);

        return tempFilePath;
    }
    static async saveToStorage(target: string, fileBuffer: Buffer) {
        const targetDir = path.join(__dirname, '../../storage');
        await fs.mkdir(targetDir, { recursive: true });
        const filePath = path.join(targetDir, target);
        await fs.writeFile(filePath, fileBuffer);
    }
    static async saveFile(filePath: string, fileBuffer: Buffer) {
        const ext = await this.getFileType(fileBuffer);
        const fileName = `${this.hashBuffer(fileBuffer)}.${ext}`;

        const targetDir = path.join(__dirname, `../../storage/${filePath}`);
        await fs.mkdir(targetDir, { recursive: true });

        const fullPath = path.join(targetDir, fileName);
        await fs.writeFile(fullPath, fileBuffer);

        return fileName;
    }
    static async deleteFromStorage(target: string) {
        const targetDir = path.join(__dirname, `../../storage/${target}`);
        await fs.rm(targetDir, { recursive: true, force: true });
    }
    static async getFromStorage(target: string) {
        const targetDir = path.join(__dirname, `../../storage/${target}`);
        const fileBuffer = await fs.readFile(targetDir);
        return {
            buffer: fileBuffer,
            ext: await this.getFileType(fileBuffer)
        };
    }
    static async getFromWebStorage(target: string) {
        const targetDir = `${Config.WEB_STORAGE}${target}`;
        try {
            const fileBuffer = await fs.readFile(targetDir);
            return fileBuffer;
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                return undefined;
            }
            throw err;
        }
    }
    static async getFileType(buffer: Buffer): Promise<string> {
        try {
            const fileType = await fileTypeFromBuffer(buffer);

            if (!fileType || !fileType.ext) {
                throw new Error('Не удалось определить расширение файла');
            }
    
            return fileType.ext;
        } catch {
            return 'undefined';
        }
    }
    static async getFileByID (id) {
        const file = await dbQueryM('SELECT * FROM `files` WHERE `id` = ?', [id]);
        if (file.length > 0) {
            const buffer = await this.getFromStorage(`/messenger/pools/${file[0].pool}/${file[0].name}`);
            return buffer;
        }
        return null;
    }
    static hashBuffer(buffer: Buffer, algorithm: string = 'sha256'): string {
        return crypto.createHash(algorithm).update(buffer).digest('hex');
    }
}

export default FileManager;