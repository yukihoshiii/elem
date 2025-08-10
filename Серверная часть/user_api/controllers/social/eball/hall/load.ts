import AccountDataHelper from '../../../../../services/account/AccountDataHelper.js';
import RouterHelper from '../../../../../services/system/RouterHelper.js';
import { dbQueryE } from '../../../../../system/global/DataBase.js';

const accountDataHelper = new AccountDataHelper();

const load = async () => {
    const users = [];
    const rows = await dbQueryE('SELECT * FROM accounts WHERE Eballs > 0 ORDER BY Eballs DESC LIMIT 100');

    for (const row of rows) {
        const icons = [];

        icons.push(...await accountDataHelper.getIcons(row.ID));

        users.push({
            id: row.ID,
            name: row.Name,
            username: row.Username,
            avatar: AccountDataHelper.getAvatar(row.Avatar),
            icons: icons,
            eballs: row.Eballs,
        });
    }

    return RouterHelper.sendAnswer({
        users: users.sort((a, b) => b.eballs - a.eballs),
    });
};

export default load;
