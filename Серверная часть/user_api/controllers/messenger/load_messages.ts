import { dbQueryM } from '../../../system/global/DataBase.js';
import { getSession } from '../../../system/global/AccountManager.js';
import { getChatData } from '../../../system/global/Function.js';
import { aesEncryptUnit8 } from '../../../system/global/Crypto.js';
import AccountDataHelper from '../../../services/account/AccountDataHelper.js';
import GroupManager from '../../../services/messenger/GroupManager.js';

const loadMessages = async ({ account, data }) => {
    const session = await getSession(account.ID);
    const mesKey = session?.mesKey;

    if (mesKey) {
        const chatData = await getChatData({
            account: account,
            target: {
                type: data.target.type,
                id: data.target.id
            },
            create: false,
            message: '',
            isMedia: false
        });

        if (!chatData) return {
            status: 'error',
            message: 'Чат не найден'
        };

        if (chatData) {
            await dbQueryM('UPDATE `chats` SET `notifications` = 0 WHERE `uid` = ? AND `chat_id` = ? AND `chat_type` = ?', [account.ID, chatData.id, chatData.type]);
            const messagesArray = [];
            const startIndex = parseInt(data.startIndex) || 0;
            const messages = await dbQueryM('SELECT * FROM `messages_structure` WHERE `chat_id` = ? AND `chat_type` = ? ORDER BY `date` DESC LIMIT ?, 25', [chatData.id, chatData.type, startIndex]);
            const accountDataHelper = new AccountDataHelper();

            if (chatData.type === 1) {
                const groupManager = new GroupManager(account.ID);
                const isJoined = await groupManager.validateMember(chatData.id);

                if (!isJoined) {
                    return {
                        status: 'error',
                        messages: 'У вас нет доступа к этим сообщениям'
                    }
                }
            }

            for (const mes of messages) {
                if (chatData.type === 0) {
                    const encrypted_me = await dbQueryM('SELECT * FROM `messages` WHERE `uid` = ? AND `mid` = ?', [account.ID, mes.mid]);
                    const encrypted_user = await dbQueryM('SELECT * FROM `messages` WHERE `uid` = ? AND `mid` = ?', [data.target.id, mes.mid]);

                    if (encrypted_me.length > 0 && encrypted_user.length > 0) {
                        await dbQueryM('DELETE FROM `messages_notsent` WHERE `mid` = ?', [mes.mid]);
                    } else {
                        if (encrypted_me.length < 1) {
                            const message = await dbQueryM('SELECT * FROM `messages_notsent` WHERE `mid` = ?', [mes.mid]);

                            if (message.length > 0) {
                                const encryptedMessage = Buffer.from(aesEncryptUnit8(message[0].content, mesKey));
                                await dbQueryM('INSERT INTO `messages` (`uid`, `mid`, `type`, `encrypted`) VALUES (?, ?, ?, ?)', [account.ID, mes.mid, 1, encryptedMessage]);
                                const messageArray = {
                                    uid: mes.uid,
                                    mid: mes.mid,
                                    encrypted: new Uint8Array(encryptedMessage),
                                    version: 1,
                                    date: mes.date
                                }
                                messagesArray.push(messageArray);
                            }
                        }
                    }
                    if (encrypted_me[0] && encrypted_me[0].encrypted) {
                        messagesArray.push({
                            uid: mes.uid,
                            mid: mes.mid,
                            encrypted: new Uint8Array(encrypted_me[0].encrypted),
                            version: encrypted_me[0].type,
                            date: mes.date
                        });
                    }
                }
                if (chatData.type === 1) {
                    const encrypted_me = await dbQueryM('SELECT * FROM `messages` WHERE `uid` = ? AND `mid` = ?', [account.ID, mes.mid]);

                    if (encrypted_me.length < 1) {
                        const message = await dbQueryM('SELECT * FROM `messages_notsent` WHERE `mid` = ?', [mes.mid]);

                        if (message.length > 0) {
                            const encryptedMessage = Buffer.from(aesEncryptUnit8(message[0].content, mesKey));
                            await dbQueryM('INSERT INTO `messages` (`uid`, `mid`, `type`, `encrypted`) VALUES (?, ?, ?, ?)', [account.ID, mes.mid, 1, encryptedMessage]);
                            messagesArray.push({
                                uid: mes.uid,
                                mid: mes.mid,
                                author: await accountDataHelper.getAuthorData(mes.uid),
                                encrypted: new Uint8Array(encryptedMessage),
                                version: 1,
                                date: mes.date
                            });
                        }
                    }
                    if (encrypted_me[0] && encrypted_me[0].encrypted) {
                        messagesArray.push({
                            uid: mes.uid,
                            mid: mes.mid,
                            author: await accountDataHelper.getAuthorData(mes.uid),
                            encrypted: new Uint8Array(encrypted_me[0].encrypted),
                            version: encrypted_me[0].type,
                            date: mes.date
                        });
                    }
                }
            }

            return {
                status: 'success',
                messages: messagesArray
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export default loadMessages;