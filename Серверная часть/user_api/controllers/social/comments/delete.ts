import { dbQueryE } from '../../../../system/global/DataBase.js';
import RouterHelper from '../../../../services/system/RouterHelper.js';
import { recount } from './add.js';

const delete_comment = async ({ account, data }) => {
    const { comment_id } = data.payload;

    const comment = await dbQueryE('SELECT * FROM comments WHERE id = ?', [comment_id]);

    if (!comment.length || comment.length < 1) return RouterHelper.sendError('Комментарий не найден');
    if (comment[0].uid !== account.ID) return RouterHelper.sendError('Вы не владелец комментария');

    await dbQueryE('DELETE FROM comments WHERE id = ?', [comment_id]);
    await recount(comment[0].post_id);

    return RouterHelper.sendAnswer({ message: 'Комментарий удален' });
}

export default delete_comment;
