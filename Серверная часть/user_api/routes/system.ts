import { getLastUsers, getGoldUsers, getUpdates } from '../controllers/system/info.js';

const handlers = {
    // Последние пользователи
    get_last_users: getLastUsers,
    // Особенные пользователи
    get_gold_users: getGoldUsers,
    // обновления
    get_updates: getUpdates
};

const system = async (ws, action, data) => {
    if (!handlers[action]) {
        return { status: 'error', message: 'Такого действия нет' };
    }

    const result = await handlers[action]({ account: ws.account, data });
    return { action, ...result };
};

export default system;