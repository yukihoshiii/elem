import AccountManager from '../../../../services/account/AccountManager.js';
import { dbQueryE } from '../../../../system/global/DataBase.js';
import Validator from '../../../../services/system/Validator.js';
import { fileTypeFromBuffer } from 'file-type';
import ImageEngine from '../../../../services/system/ImageEngine.js';
import FileManager from '../../../../services/system/FileManager.js';
import { getDate } from '../../../../system/global/Function.js';
import RouterHelper from '../../../../services/system/RouterHelper.js';
import AccountDataHelper from '../../../../services/account/AccountDataHelper.js';

const imageEngine = new ImageEngine();
const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];

const getFilesType = async (
    files: { name: string, type: string, size: number, buffer: Uint8Array }[]
): Promise<'images' | 'files' | 'mixed'> => {
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

export const recount = async (postID: number) => {
    const comments = await dbQueryE('SELECT COUNT(*) AS count FROM comments WHERE post_id = ?', [postID]);
    await dbQueryE('UPDATE posts SET Comments = ? WHERE ID = ?', [comments[0].count, postID]);
}

const postExists = async (postID: number) => {
    const post = await dbQueryE('SELECT COUNT(*) AS count FROM posts WHERE ID = ?', [postID]);
    return post[0].count > 0;    
}

const add = async ({ account, data }) => {
    const accountManager = new AccountManager(account.ID);
    const isGold = await accountManager.getGoldStatus();

    const { text, files, post_id, reply_to } = data.payload;
    const now = Date.now();

    const filesCount = files?.length || 0;
    const fileSizeLimit = isGold ? 50 * 1024 * 1024 : 20 * 1024 * 1024;

    if (!text && text.trim() === '' && filesCount < 1) return RouterHelper.sendError('Нельзя отправить пустой комментарий');

    const validator = new Validator();

    if (text) {
        validator.validateText({
            title: 'Текст комментария',
            value: text,
            maxLength: isGold ? 3400 : 1400
        });
    }

    if (!await postExists(post_id)) {
        return RouterHelper.sendError('Пост не найден');
    }

    const lastComment = await dbQueryE(
        'SELECT date FROM comments WHERE uid = ? ORDER BY date DESC LIMIT 1',
        [account.ID]
    );

    if (lastComment.length && now - new Date(lastComment[0].date).getTime() < 15000)
        return RouterHelper.sendError('Куда так быстро?');

    let totalFileSize = 0;
    let contentType = 'text';
    let content: any = {};

    if (files.length > 150) {
        return RouterHelper.sendError('Можно добавить не более 150 файлов');
    }

    if (filesCount > 0) {
        if (filesCount > 150) return RouterHelper.sendError('Максимальное количество файлов 150');

        contentType = await getFilesType(files);

        for (const file of files) {
            totalFileSize += file.buffer.length;
            if (totalFileSize > fileSizeLimit) break;
        }

        if (totalFileSize > fileSizeLimit)
            return isGold
                ? RouterHelper.sendError('Размер файлов не должен превышать 50 MB.')
                : RouterHelper.sendError('Размер файлов не должен превышать 20 MB, вы можете увеличить лимит до 50 MB, купив подписку Gold.');
    }

    if (reply_to) {
        const comment = await dbQueryE('SELECT * FROM comments WHERE id = ?', [reply_to]);

        if (comment.length < 1) return RouterHelper.sendError('Комментарий не найден');

        const accountDataHelper = new AccountDataHelper();
        const author = await accountDataHelper.getAuthorData(comment[0].uid);

        if (!author) return RouterHelper.sendError('Автор комментария не найден');

        content.reply = {
            comment_id: comment[0].id,
            author: {
                id: author.id,
                name: author.name,
                username: author.username,
                avatar: author.avatar
            },
            text: comment[0].text,
            update_date: getDate()
        }
    }

    let c_images = [];
    let c_files = [];

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

    for (const image of c_images) {
        const file = await imageEngine.create({
            file: image.buffer,
            path: 'comments/images',
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

    if (c_files.length > 0) {
        for (const file of c_files) {
            const uploadedFile = await FileManager.saveFile('comments/files', file.buffer);

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
    
    const res = await dbQueryE('INSERT INTO comments (uid, post_id, type, text, content, date) VALUES (?, ?, ?, ?, ?, ?)', [
        account.ID,
        post_id,
        contentType,
        text,
        content ? JSON.stringify(content) : null,
        getDate()
    ]);

    await recount(post_id);

    return RouterHelper.sendAnswer({
        comment_id: res.insertId
    })
}

export default add;