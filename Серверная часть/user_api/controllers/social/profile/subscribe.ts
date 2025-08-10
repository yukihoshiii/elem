import AccountDataHelper from '../../../../services/account/AccountDataHelper.js';
import RouterHelper from '../../../../services/system/RouterHelper.js';
import { dbQueryE } from '../../../../system/global/DataBase.js';

const recountSubscribers = async (data) => {
    const res = await dbQueryE(
        'SELECT COUNT(*) AS Count FROM subscriptions WHERE Target = ? AND TargetType = ?',
        [data.id, data.type]
    );
    const count = res[0].Count;

    const updateQuery = data.type === 0
        ? 'UPDATE accounts SET Subscribers = ? WHERE ID = ?'
        : 'UPDATE channels SET Subscribers = ? WHERE ID = ?';

    await dbQueryE(updateQuery, [count, data.id]);
};

const recountSubscriptions = async (account) => {
    const res = await dbQueryE(
        'SELECT COUNT(*) AS Count FROM subscriptions WHERE User = ? AND TargetType = 0',
        [account.ID]
    );
    const count = res[0].Count;

    await dbQueryE('UPDATE accounts SET Subscriptions = ? WHERE ID = ?', [count, account.ID]);
};

const subscribe = async ({ account, data }) => {
    const { username } = data.payload || {};

    if (!username) {
        return RouterHelper.sendError('И на кого подписываться?');
    }

    const userData: any = await AccountDataHelper.getDataFromUsername(username);

    if (!userData) {
        return RouterHelper.sendError('Такого пользователя нет');
    }

    if (userData.type === 0 && userData.id === account.ID) {
        return RouterHelper.sendError('Нельзя на себя подписаться');
    }

    const existingSubs = await dbQueryE(
        'SELECT * FROM subscriptions WHERE User = ? AND Target = ? AND TargetType = ?',
        [account.ID, userData.id, userData.type]
    );

    if (existingSubs.length === 0) {
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await dbQueryE(
            'INSERT INTO subscriptions (User, Target, TargetType, Date) VALUES (?, ?, ?, ?)',
            [account.ID, userData.id, userData.type, date]
        );
    } else {
        const subID = existingSubs[0].ID;
        await dbQueryE('DELETE FROM subscriptions WHERE ID = ?', [subID]);
    }

    await recountSubscribers(userData);
    await recountSubscriptions(account);

    return RouterHelper.sendAnswer();
}

export default subscribe;