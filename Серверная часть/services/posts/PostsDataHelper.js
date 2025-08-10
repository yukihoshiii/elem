import { dbQueryE } from '../../system/global/DataBase.js';

class PostDataHelper {
    constructor(pid) {
        this.pid = pid;
        this._isValid = undefined;
    }

    async isValidPost() {
        if (this._isValid !== undefined) {
            return this._isValid;
        }
        const posts = await dbQueryE('SELECT * FROM `posts` WHERE `ID` = ?', [this.pid]);
        this._isValid = posts.length > 0;
        return this._isValid;
    }

    async postLiked(uid) {
        if (!(await this.isValidPost())) return false;
        
        const like = await dbQueryE('SELECT * FROM `post_likes` WHERE `PostID` = ? AND `UserID` = ?', [this.pid, uid]);
        return like.length > 0 ? true : false;
    }

    async postDisliked(uid) {
        if (!(await this.isValidPost())) return false;

        const dislike = await dbQueryE('SELECT * FROM `post_dislikes` WHERE `PostID` = ? AND `UserID` = ?', [this.pid, uid]);
        return dislike.length > 0 ? true : false;
    }
}

export default PostDataHelper;