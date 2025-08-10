import RouterHelper from '../../../../../services/system/RouterHelper.js';
import { dbQueryE } from '../../../../../system/global/DataBase.js';

const delete_session = async ({ account, data }) => {
    const { session_id } = data;

    if (!session_id) {
        return RouterHelper.sendError('Не указана сессия для удаления');
    }

    const result = await dbQueryE(
        'DELETE FROM `accounts_sessions` WHERE `id` = ? AND `uid` = ?',
        [session_id, account.ID]
    );

    if (result.affectedRows === 0) {
        return RouterHelper.sendError('Сессия не найдена, или у вас нет прав для её удаления');
    }

    return RouterHelper.sendAnswer();
}

export default delete_session;