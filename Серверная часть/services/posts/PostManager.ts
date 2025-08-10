import { fileTypeFromBuffer } from 'file-type';
import { dbQueryE } from '../../system/global/DataBase.js';
import { getDate } from '../../system/global/Function.js';
import AccountDataHelper from '../account/AccountDataHelper.js';
import RouterHelper from '../system/RouterHelper.js';
import AccountManager from '../account/AccountManager.js';
import Validator from '../system/Validator.js';
import FileManager from '../system/FileManager.js';
import ImageEngine from '../system/ImageEngine.js';

const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
const imageEngine = new ImageEngine();

class PostManager {
    static create = async ({ account, payload }) => {
        const accountManager = new AccountManager(account.ID);
        const isGold = await accountManager.getGoldStatus();
        const { text, files, type, wall, from } = payload;

        let sender = {
            id: account.ID,
            type: 0
        }

        if (from && from.id && from.type) {
            if (from.type === 1) {
                const channel = await dbQueryE('SELECT * FROM `channels` WHERE `ID` = ? AND `Owner` = ?', [from.id, account.ID]);

                if (channel) {
                    sender = {
                        id: channel[0].ID,
                        type: 1
                    }
                } else {
                    return RouterHelper.sendError('Канал не найден');
                }
            }
        }

        const filesCount = files?.length || 0;
        const fileSizeLimit = isGold ? 50 * 1024 * 1024 : 20 * 1024 * 1024;

        if (!text && text.trim() === '' && filesCount < 1) return RouterHelper.sendError('Нельзя отправить пустой пост');
        if (await this.checkTime({ id: sender.id, type: sender.type })) return RouterHelper.sendError('Отправить пост можно раз в 15 секунд');

        const validator = new Validator();

        if (text) {
            validator.validateText({
                title: 'Текст поста',
                value: text,
                maxLength: isGold ? 3400 : 1400
            });
        }

        let totalFileSize = 0;
        let contentType = 'text';
        let content: any = {};

        if (files && files?.length > 150) {
            return RouterHelper.sendError('Можно добавить не более 150 файлов');
        }

        if (filesCount > 0) {
            if (filesCount > 150) return RouterHelper.sendError('Максимальное количество файлов 150');

            contentType = await this.getFilesType(files);

            for (const file of files) {
                totalFileSize += file.buffer.length;
                if (totalFileSize > fileSizeLimit) break;
            }

            if (totalFileSize > fileSizeLimit)
                return isGold
                    ? RouterHelper.sendError('Размер файлов не должен превышать 50 MB.')
                    : RouterHelper.sendError('Размер файлов не должен превышать 20 MB, вы можете увеличить лимит до 50 MB, купив подписку Gold.');
        }

        let c_images = [];
        let c_files = [];

        if (files && files?.length > 0) {
            for (const file of files) {
                const fileType = await fileTypeFromBuffer(file.buffer);

                if (fileType?.mime.startsWith('image/')) {
                    c_images.push({
                        buffer: file.buffer,
                        name: file.name
                    });
                } else {
                    c_files.push({
                        buffer: file.buffer,
                        name: file.name
                    });
                }
            }

            if (c_images.length > 0) {
                for (const image of c_images) {
                    const file = await imageEngine.create({
                        file: image.buffer,
                        path: 'posts/images',
                        simpleSize: 900,
                        preview: true
                    });
    
                    if (file) {
                        if (!content.images) content.images = [];
    
                        content.images.push({
                            img_data: file,
                            file_name: image.name,
                            file_size: image.buffer.length
                        });
                    }
                }
            }
    
            if (c_files.length > 0) {
                for (const file of c_files) {
                    const uploadedFile = await FileManager.saveFile('posts/files', file.buffer);
    
                    if (uploadedFile) {
                        if (!content.files) content.files = [];
    
                        content.files.push({
                            file: uploadedFile,
                            name: file.name,
                            size: file.buffer.length
                        });
                    }
                }
            }
        }

        const res = await dbQueryE('INSERT INTO `posts` (`author_id`, `author_type`, `content_type`, `text`, `content`, `date`) VALUES (?, ?, ?, ?, ?, ?)', [
            sender.id,
            sender.type,
            contentType,
            text,
            content ? JSON.stringify(content) : null,
            getDate()
        ])

        if (type === 'wall' && wall && wall.username) {
            const profileData = await AccountDataHelper.getDataFromUsername(wall.username);

            if (profileData && profileData.id !== undefined && profileData.type !== undefined) {
                await dbQueryE('INSERT INTO `wall` (`author_id`, `author_type`, `pid`) VALUES (?, ?, ?)', [profileData.id, profileData.type, res.insertId]);
                await dbQueryE('UPDATE `posts` SET `hidden` = 1 WHERE `id` = ?', [res.insertId]);
            }
        }

        await this.recount(sender.id, sender.type);

        return RouterHelper.sendAnswer({ post_id: res.insertId })
    }

    static async getFilesType(
        files: { name: string, type: string, size: number, buffer: Uint8Array }[]
    ): Promise<'images' | 'files' | 'mixed'> {
        let hasImage = false;
        let hasFile = false;

        for (const file of files) {
            const buffer = Buffer.from(file.buffer);
            const type = await fileTypeFromBuffer(buffer);

            if (type && validImageTypes.includes(type.mime)) {
                hasImage = true;
            } else {
                hasFile = true;
            }

            if (hasImage && hasFile) return 'mixed';
        }

        if (hasImage) return 'images';
        if (hasFile) return 'files';

        return 'files';
    };

    static async recount(author_id, author_type) {
        if (author_type === 0) {
            const posts = await dbQueryE('SELECT COUNT(*) AS count FROM posts WHERE author_id = ? AND author_type = 0 AND hidden = 0', [author_id]);
            await dbQueryE('UPDATE accounts SET Posts = ? WHERE ID = ?', [posts[0].count, author_id]);
        } else if (author_type === 1) {
            const posts = await dbQueryE('SELECT COUNT(*) AS count FROM posts WHERE author_id = ? AND author_type = 1 AND hidden = 0', [author_id]);
            await dbQueryE('UPDATE channels SET Posts = ? WHERE ID = ?', [posts[0].count, author_id]);
        }
    }

    static async checkTime(from) {
        const rows = await dbQueryE(
            'SELECT * FROM `posts` WHERE `author_id` = ? AND `author_type` = ? ORDER BY `date` DESC LIMIT 1',
            [from.id, from.type]
        );

        if (rows.length > 0) {
            const timeLimit = 15;
            const lastPostTime = new Date(rows[0].date).getTime() / 1000;
            const currentTime = Math.floor(Date.now() / 1000);
            const elapsedTime = currentTime - lastPostTime;

            return elapsedTime < timeLimit;
        }
    }
}

export default PostManager;