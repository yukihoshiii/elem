import RouterHelper from '../../../../../services/system/RouterHelper.js';
import { dbQueryE } from '../../../../../system/global/DataBase.js';

const load = async ({ data }) => {
    const payload = data?.payload ?? {};
    const { start_index = 0, search_value = '' } = payload;
    const limit = 50;

    let query;
    let params;

    if (search_value) {
        const like = `%${search_value}%`;
        query = `
            SELECT * FROM accounts
            WHERE Name LIKE ? OR Username LIKE ? OR Email LIKE ?
            ORDER BY ID ASC LIMIT ?, ?
        `;
        params = [like, like, like, start_index, limit];
    } else {
        query = `SELECT * FROM accounts ORDER BY ID ASC LIMIT ?, ?`;
        params = [start_index, limit];
    }

    const rows = await dbQueryE(query, params);
    const users = rows.map(user => ({
        id: user.ID,
        name: user.Name,
        username: user.Username,
        email: user.Email,
        avatar: user.Avatar,
    }));

    const countRows = await dbQueryE(`SELECT COUNT(*) AS users_count FROM accounts`);
    const users_count = countRows[0]?.users_count ?? 0;

    return RouterHelper.sendAnswer({
        users_count,
        users
    });
};

export default load;
