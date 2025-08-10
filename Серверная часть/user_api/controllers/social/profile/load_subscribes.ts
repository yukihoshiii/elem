import AccountDataHelper from '../../../../services/account/AccountDataHelper.js';
import RouterHelper from '../../../../services/system/RouterHelper.js';
import { dbQueryE } from '../../../../system/global/DataBase.js';

const load_subscribers = async ({ data }) => {
    const { username, start_index = 0 } = data.payload || {};
    const limit = 25;

    const userData: any = await AccountDataHelper.getDataFromUsername(username);

    if (!userData) {
        return RouterHelper.sendError('Такого пользователя нет');
    }

    const subs = await dbQueryE(
        `SELECT * FROM subscriptions 
         WHERE Target = ? AND TargetType = ? 
         ORDER BY Date DESC 
         LIMIT ?, ?`,
        [userData.id, userData.type, start_index, limit]
    );

    const result = [];

    for (const row of subs) {
        const sourceData = await dbQueryE(`SELECT * FROM accounts WHERE ID = ?`, [row.User]);
        if (sourceData.length === 0) continue;

        const user = sourceData[0];
        result.push({
            id: row.ID,
            name: user.Name,
            username: user.Username,
            avatar: user.Avatar,
            posts: user.Posts,
            subscribers: user.Subscribers,
            date: row.Date
        });
    }

    return RouterHelper.sendAnswer({
        users: result
    });
}

export default load_subscribers;
