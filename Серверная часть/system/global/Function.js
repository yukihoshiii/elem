import { dbQueryE, dbQueryM } from '../global/DataBase.js';
import { sendMessageToUser } from './AccountManager.js';
import { aesEncryptUnit8, sendAES } from './Crypto.js';
import { getSession } from './AccountManager.js';
import GroupManager from '../../services/messenger/GroupManager.js';

// Создание значений разных всяких

export const getDate = () => {
    const date = new Date();
    const formattedDate = date.toISOString().replace('Z', '+00:00');
    return formattedDate;
}

export const createMesID = async (length) => {
    while (true) {
        let id = '';
        for (let i = 0; i < length; i++) {
            id += Math.floor(Math.random() * 10);
        }
        const answer = await dbQueryM('SELECT * FROM `messages_structure` WHERE `mid` = ?', [id]);
        if (answer < 1) {
            return id;
        }
    }
}

export const getRandomBinary = () => {
    return Math.round(Math.random());
}

export const checkValidUID = async (uid) => {
    const user = await dbQueryE('SELECT 1 FROM `accounts` WHERE `ID` = ? LIMIT 1', [uid]);
    return Boolean(user);
}

const createChats = async (account, uid, cid) => {
    const uids = [account.ID, uid];
    for (let uid of uids) {
        let chats = await dbQueryM('SELECT * FROM `chats` WHERE `uid` = ? AND `chat_id` = ? AND `chat_type` = 0', [uid, cid]);
        if (chats.length < 1) {
            await dbQueryM('INSERT INTO `chats` (`uid`, `chat_id`, `chat_type`) VALUES (?, ?, 0)', [uid, cid]);
        }
    }
}

export const getChatData = async ({ account, target, create, message, isMedia }) => {
    if (target.type === 0) {
        let chat = await dbQueryM('SELECT * FROM `chats_dm` WHERE (`uid_1` = ? AND `uid_2` = ?) OR (`uid_1` = ? AND `uid_2` = ?)', [account.ID, target.id, target.id, account.ID]);

        if (create) {
            const lastMessage = isMedia ? 'Файл' : message.text;

            if (chat.length < 1) {
                await dbQueryM('INSERT INTO `chats_dm` (`uid_1`, `uid_2`, `last_message`, `last_message_date`, `create_date`) VALUES (?, ?, ?, ?, ?)', [account.ID, target.id, lastMessage, getDate(), getDate()]);
            } else {
                await dbQueryM('UPDATE `chats_dm` SET `last_message` = ?, `last_message_date` = ? WHERE `id` = ?', [lastMessage, getDate(), chat[0].id]);
            }

            chat = await dbQueryM('SELECT * FROM `chats_dm` WHERE (`uid_1` = ? AND `uid_2` = ?) OR (`uid_1` = ? AND `uid_2` = ?)', [account.ID, target.id, target.id, account.ID]);
            createChats(account, target.id, chat[0].id);
        }

        return {
            id: chat[0].id,
            type: 0
        }
    }
    if (target.type === 1) {

        if (create) {
            const lastMessage = isMedia ? 'Файл' : message.text;

            const chat = await dbQueryM('SELECT * FROM `groups` WHERE `id` = ?', [target.id]);

            if (chat.length > 0) {
                await dbQueryM('UPDATE `groups` SET `last_message` = ?, `last_message_date` = ? WHERE `id` = ?', [lastMessage, getDate(), chat[0].id]);
            }
        }
        
        return {
            id: target.id,
            type: 1
        }
    }
}

// Отправка сообщений пользователю

export const pushMessage = async ({ account, target, message, isMedia }) => {
    if (!message || !target) {
        return;
    }
    if (!message?.text || typeof message?.text !== 'string' || message?.text.trim() === '') return;

    const mesID = await createMesID(6);
    const session = await getSession(account.ID);
    const messageString = JSON.stringify(message);
    if (!session) return;

    if (!messageString || typeof messageString !== 'string' || messageString.trim() === '') return;

    if (target.type === 0) {
        if (!checkValidUID(target.id)) return;

        const user = await getSession(target.id);
        const chatData = await getChatData({
            account: account,
            target: target,
            create: true,
            message: message,
            isMedia: isMedia
        });

        if (!chatData.id) return;
        if (!session || !session.mesKey) return;

        const encMesMe = aesEncryptUnit8(messageString, session.mesKey);

        await dbQueryM('INSERT INTO `messages_structure` (`uid`, `mid`, `chat_id`, `chat_type`, `date`) VALUES (?, ?, ?, ?, ?)', [account.ID, mesID, chatData.id, 0, getDate()]);
        await dbQueryM('INSERT INTO `messages` (`uid`, `mid`, `type`, `encrypted`) VALUES (?, ?, ?, ?)', [account.ID, mesID, 1, Buffer.from(encMesMe)]);

        if (user && user.mesKey) {
            const encMes = aesEncryptUnit8(messageString, user.mesKey);
            await dbQueryM('INSERT INTO `messages` (`uid`, `mid`, `type`, `encrypted`) VALUES (?, ?, ?, ?)', [target.id, mesID, 1, Buffer.from(encMes)]);
        }

        if (account.ID !== target.id) {
            await dbQueryM('INSERT INTO `messages_notsent` (`mid`, `content`) VALUES (?, ?)', [mesID, messageString]);
            await dbQueryM('INSERT INTO `notifications` (`uid`, `chat_id`, `chat_type`, `type`) VALUES (?, ?, ?, ?)', [target.id, chatData.id, chatData.type, 0]);

            if (user && user.connection) {
                sendMessageToUser({
                    uid: user.ID,
                    message: await sendAES({
                        data: {
                            type: 'messenger',
                            action: 'new_message',
                            mid: Number(mesID),
                            target: {
                                id: account.ID,
                                type: 0
                            },
                            message: messageString,
                            date: getDate()
                        },
                        key: user.aesKey
                    })
                })
            }
        }

        return {
            mid: mesID,
            chat_id: chatData.id,
        };
    }

    if (target.type === 1) {
        const groupManager = new GroupManager(account.ID);

        if (!groupManager.validateGroup(target.id)) return;

        const chatData = await getChatData({
            account: account,
            target: target,
            create: true,
            message: message,
            isMedia: isMedia
        });

        if (!chatData.id) return;
        if (!session || !session.mesKey) return;

        const encMesMe = aesEncryptUnit8(messageString, session.mesKey);

        await dbQueryM('INSERT INTO `messages_structure` (`uid`, `mid`, `chat_id`, `chat_type`, `date`) VALUES (?, ?, ?, ?, ?)', [account.ID, mesID, chatData.id, 1, getDate()]);
        await dbQueryM('INSERT INTO `messages` (`uid`, `mid`, `type`, `encrypted`) VALUES (?, ?, ?, ?)', [account.ID, mesID, 1, Buffer.from(encMesMe)]);
        await dbQueryM('INSERT INTO `messages_notsent` (`mid`, `content`) VALUES (?, ?)', [mesID, messageString]);
        await dbQueryM('INSERT INTO `notifications` (`uid`, `chat_id`, `chat_type`, `type`) VALUES (?, ?, ?, ?)', [target.id, chatData.id, chatData.type, 0]);

        const members = await groupManager.loadMembers(chatData.id);

        if (members) {
            for (const member of members) {
                if (member.id !== account.ID) {
                    const user = await getSession(member.id);

                    if (user && user.connection) {
                        sendMessageToUser({
                            uid: user.ID,
                            message: await sendAES({
                                data: {
                                    type: 'messenger',
                                    action: 'new_message',
                                    mid: Number(mesID),
                                    uid: account.ID,
                                    author: {
                                        id: account.ID,
                                        name: account.Name,
                                        username: account.Username,
                                        avatar: account.Avatar
                                    },
                                    target: {
                                        id: chatData.id,
                                        type: chatData.type
                                    },
                                    message: messageString,
                                    date: getDate()
                                },
                                key: user.aesKey
                            })
                        })
                    }
                }
            }
        }

        return {
            mid: mesID,
            chat_id: chatData.id,
        };
    }
};

export const createError = (message) => {
    return { status: 'error', message: message };
}