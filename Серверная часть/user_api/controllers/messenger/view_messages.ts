import { dbQueryM } from '../../../system/global/DataBase.js';
import { getChatData } from '../../../system/global/Function.js';

const viewMessages = async ({ account, data }) => {
    const chatData = await getChatData({
        account: account,
        target: data.target,
        create: false,
        message: '',
        isMedia: false
    });

    if (!chatData) return;

    await dbQueryM('DELETE FROM `notifications` WHERE `uid` = ? AND `chat_id` = ? AND `chat_type` = ?', [account.ID, chatData.id, chatData.type]);

    return {
        status: 'success'
    }
}

export default viewMessages;