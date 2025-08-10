import { dbQueryE } from "../../../../system/global/DataBase.js";
import { getDate } from "../../../../system/global/Function.js";

export const like = async ({ account, data }) => {
    const { post_id } = data.payload;

    if (await userLiked(post_id, account.ID)) {
        await dbQueryE("DELETE FROM post_likes WHERE PostID = ? AND UserID = ?", [post_id, account.ID]);
    } else {
        if (await userDisliked(post_id, account.ID)) {
            await dbQueryE("DELETE FROM post_dislikes WHERE PostID = ? AND UserID = ?", [post_id, account.ID]);
        }
        await dbQueryE("INSERT INTO post_likes (PostID, UserID, Date) VALUES (?, ?, ?)", [post_id, account.ID, getDate()]);
    }

    await recalculate(post_id);
};

export const dislike = async ({ account, data }) => {
    const { post_id } = data.payload;

    if (await userDisliked(post_id, account.ID)) {
        await dbQueryE("DELETE FROM post_dislikes WHERE PostID = ? AND UserID = ?", [post_id, account.ID]);
    } else {
        if (await userLiked(post_id, account.ID)) {
            await dbQueryE("DELETE FROM post_likes WHERE PostID = ? AND UserID = ?", [post_id, account.ID]);
        }
        await dbQueryE("INSERT INTO post_dislikes (PostID, UserID, Date) VALUES (?, ?, ?)", [post_id, account.ID, getDate()]);
    }

    await recalculate(post_id);
};

const userLiked = async (postId, userId) => {
    const rows = await dbQueryE("SELECT 1 FROM post_likes WHERE PostID = ? AND UserID = ?", [postId, userId]);
    return rows.length > 0;
};

const userDisliked = async (postId, userId) => {
    const rows = await dbQueryE("SELECT 1 FROM post_dislikes WHERE PostID = ? AND UserID = ?", [postId, userId]);
    return rows.length > 0;
};

const recalculate = async (postId) => {
    await dbQueryE(`
        UPDATE posts
        SET likes = (SELECT COUNT(*) FROM post_likes WHERE PostID = ?),
            dislikes = (SELECT COUNT(*) FROM post_dislikes WHERE PostID = ?)
        WHERE id = ?
    `, [postId, postId, postId]);
};