import AccountDataHelper from '../../../../services/account/AccountDataHelper.js';
import GroupManager from '../../../../services/messenger/GroupManager.js';
import ImageEngine from '../../../../services/system/ImageEngine.js';
import Validator from '../../../../services/system/Validator.js';
import Config from '../../../../system/global/Config.js';
import { dbQueryM } from '../../../../system/global/DataBase.js';
import { getDate } from '../../../../system/global/Function.js';

const createGroup = async ({ account, data }) => {
    const validator = new Validator();

    validator.validateText({
        title: 'Имя группы',
        value: data.name,
        maxLength: 100
    });

    if (data.avatar) {
        const goldStatus = await AccountDataHelper.checkGoldStatus(account.ID);

        const limit = goldStatus
            ? Config.LIMITS.GOLD.MAX_AVATAR_SIZE
            : Config.LIMITS.DEFAULT.MAX_AVATAR_SIZE;
        
        await validator.validateImage(data.avatar, limit);
    }

    const group = await dbQueryM('INSERT INTO `groups` (`name`, `owner`, `create_date`) VALUES (?, ?, ?)', [
        data.name,
        account.ID,
        getDate()
    ]);

    const groupManager = new GroupManager(account.ID);
    await groupManager.addMember(group.insertId);

    if (data.avatar) {
        const imageEngine = new ImageEngine();
        const image = await imageEngine.create({
            path: 'messenger/avatars',
            file: data.avatar
        })
        await dbQueryM('UPDATE `groups` SET `avatar` = ? WHERE `id` =?', [
            JSON.stringify(image),
            group.insertId
        ]);
    }

    await groupManager.generateLink(group.insertId);

    return {
        status: 'success',
        group_id: group.insertId
    }
}

export default createGroup;