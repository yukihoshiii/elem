import { dbQueryE, dbQueryM } from '../../../system/global/DataBase.js';

const deleteAllChats = async ({ uid }) => {
    const chatsDM = await dbQueryM('SELECT * FROM `chats_dm` WHERE `uid_1` = ? OR `uid_2` = ?', [uid, uid]);

    for (const chat of chatsDM) {
        const messages = await dbQueryM('SELECT * FROM `messages_structure` WHERE `chat_id` = ? AND `chat_type` = 0', [chat.ID]);

        for (const message of messages) {
            const messagesCount = await dbQueryM('SELECT * FROM `messages` WHERE `mid` = ?', [message.mid]);

            if (messagesCount > 0) {
                const targetMessage = await dbQueryM('SELECT * FROM `messages` WHERE `mid` = ? AND `uid` = ?', [message.mid, uid]);

                if (targetMessage.length > 0) {
                    await dbQueryM('DELETE FROM `messages` WHERE `mid` = ? AND `uid` = ?', [message.mid, uid]);
                    const targetMessage = await dbQueryM('SELECT * FROM `messages` WHERE `mid` = ? AND `uid` = ?', [message.mid, uid]);

                    if (targetMessage.length < 1) {
                        const messageNotSent = await dbQueryM('SELECT * FROM `messages_notsent` WHERE `mid` = ?', [message.mid]);

                        if (messageNotSent.length < 1) {
                            await dbQueryM('DELETE FROM `messages_structure` WHERE `mid` = ?', [message.mid]);
                        };
                    }
                }
            } else {
                const messageNotSent = await dbQueryM('SELECT * FROM `messages_notsent` WHERE `mid` = ?', [message.mid]);

                if (messageNotSent.length < 1) {
                    await dbQueryM('DELETE FROM `messages_structure` WHERE `mid` = ?', [message.mid]);
                }
            }
        }

        await dbQueryM('DELETE FROM `chats` WHERE `chat_id` = ? AND `chat_type` = 0', [chat.ID]);

        const chats = await dbQueryM('SELECT * FROM `chats` WHERE `chat_id` = ? AND `chat_type` = 0', [chat.ID]);

        if (chats.length < 1) {
            await dbQueryM('DELETE FROM `chats_dm` WHERE `ID` = ?', [chat.ID]);
        }
    }

    await dbQueryM('DELETE FROM `messages` WHERE `uid` = ?', [uid]);
    await dbQueryE('UPDATE `accounts` SET `Keyword` = 0 WHERE `ID` = ?', [uid]);
}

export default deleteAllChats;