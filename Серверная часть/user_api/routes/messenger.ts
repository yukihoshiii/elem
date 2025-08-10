import { dbQueryE, dbQueryM } from '../../system/global/DataBase.js';
import { aesDecryptUnit8, aesEncryptUnit8 } from '../../system/global/Crypto.js';
import { updateSession } from '../../system/global/AccountManager.js';
import loadChats from '../controllers/messenger/load_chats.js';
import loadChat from '../controllers/messenger/load_chat.js';
import loadMessages from '../controllers/messenger/load_messages.js';
import sendMessage from '../controllers/messenger/send_message.js';
import deleteAllChats from '../controllers/messenger/delete_all_chats.js';
import uploadFile from '../controllers/messenger/upload_file.js';
import downloadFile from '../controllers/messenger/download_file.js';
import viewMessages from '../controllers/messenger/view_messages.js';
import createGroup from '../controllers/messenger/group/create.js';
import AppError from '../../services/system/AppError.js';
import loadGroupMembers from '../controllers/messenger/group/load_members.js';
import loadGroup from '../controllers/messenger/group/load_group.js';
import joinGroup from '../controllers/messenger/group/join.js';
import generateGroupLink from '../controllers/messenger/group/generate_link.js';

const handlers = {
    load_chat: loadChat,
    load_chats: loadChats,
    load_messages: loadMessages,
    send_message: sendMessage,
    view_messages: viewMessages,
    upload_file: uploadFile,
    download_file: downloadFile,
    // группы
    create_group: createGroup,
    load_group: loadGroup,
    load_group_members: loadGroupMembers,
    join_group: joinGroup,
    generate_group_link: generateGroupLink
};

const handleReq = async (ws, action, data) => {
    if (!handlers[action]) {
        return { status: 'error', message: 'Такого действия нет' };
    }

    try {
        const result = await handlers[action]({ account: ws.account, data });
        return { action, ...result };
    } catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return { status: 'error', message: error.message };
        }
        return { status: 'error', message: 'Внутренняя ошибка сервера' };
    }
};

const connectMesKey = async ({ account, data }) => {
    try {
        const encryptedText = aesEncryptUnit8('боже фурри такие зайки', data.key);
        if (aesDecryptUnit8(encryptedText, data.key) === 'боже фурри такие зайки') {
            const result = await dbQueryE('SELECT * FROM `accounts` WHERE `ID` = ? AND `Keyword` = 1', [account.ID]);
            if (result.length < 1) {
                await dbQueryE('UPDATE `accounts` SET `Keyword` = 1 WHERE `ID` = ?', [account.ID]);
            }
            const lm = await dbQueryM('SELECT * FROM `messages` WHERE `uid` = ? LIMIT 1', [account.ID]);
            if (lm.length > 0) {
                if (aesDecryptUnit8(lm[0].encrypted, data.key)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log('Ошибка при проверке ключа:' + error);
        return false;
    }
}

const messenger = async (ws, action, data) => {
    const account = ws.account;

    if (!account) {
        return { type: 'error', content: 'Аккаунт не найден.' };
    }

    switch (action) {
        case 'aes_messages_key':
            const keyVerificationResult = await connectMesKey({
                account: account,
                data: data
            });

            if (keyVerificationResult) {
                await updateSession(account.ID, { mesKey: data.key });
                return {
                    type: 'messenger',
                    action: 'aes_messages_key',
                    status: 'success',
                    keyword: data.key
                };
            } else {
                return {
                    type: 'messenger',
                    action: 'aes_messages_key',
                    status: 'error',
                    content: 'Ключ либо не соответствует требованиям, либо вы ввели неверный ключ.'
                };
            }

        case 'delete_all_chats':
            await deleteAllChats({ uid: account.ID });
            return { type: 'delete_all_chats', status: 'success', text: 'Все чаты успешно удалены.' };

        default:
            return await handleReq(ws, action, data);
    }
}

export default messenger;