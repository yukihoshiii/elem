import RouterHelper from "../../../../services/system/RouterHelper.js";
import { dbQueryE } from "../../../../system/global/DataBase.js";

const delete_post = async ({ account, data }) => {
    const { post_id } = data.payload;

    const post = await dbQueryE('SELECT * FROM posts WHERE id = ?', [post_id]);
    
    if (post.length === 0) {
        return RouterHelper.sendError('Пост не найден');
    }

    if (post[0].author_type === 0) {
        if (Number(post[0].author_id) !== Number(account.ID)) {
            return RouterHelper.sendError('Вы не владелец этого поста');
        }
    } else if (post[0].author_type === 1) {
        const channel = await dbQueryE('SELECT * FROM channels WHERE ID = ?', [post[0].author_id]);

        if (channel.length === 0) {
            return RouterHelper.sendError('Канал не найден');
        }

        if (Number(channel[0].Owner) !== Number(account.ID)) {
            return RouterHelper.sendError('Вы не владелец этого поста');
        }
    }

    await dbQueryE('DELETE FROM comments WHERE post_id = ?', [post_id]);
    await dbQueryE('DELETE FROM post_likes WHERE PostID = ?', [post_id]);
    await dbQueryE('DELETE FROM post_dislikes WHERE PostID = ?', [post_id]);
    await dbQueryE('DELETE FROM posts WHERE id = ?', [post_id]);

    return RouterHelper.sendAnswer({
        message: 'Пост успешно удален'
    });
}

export default delete_post;
