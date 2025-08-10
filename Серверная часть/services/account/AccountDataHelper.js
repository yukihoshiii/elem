import { dbQueryE } from '../../system/global/DataBase.js';
import AccountManager from './AccountManager.js';

class AccountDataHelper {
    static async checkGoldStatus(uid) {
        const gold = await dbQueryE(
            'SELECT * FROM `gold_subs` WHERE `uid` = ? AND `status` = 1 LIMIT 1',
            [uid]
        );
        return gold && gold.length > 0;
    }

    static async getDataFromUsername(username) {
        let profileType = 0;
        let profile = await dbQueryE('SELECT * FROM `accounts` WHERE `Username` = ?', [username]);

        if (!profile[0]?.ID) {
            profile = await dbQueryE('SELECT * FROM `channels` WHERE `Username` = ?', [username]);
            if (!profile) return false;
            profileType = 1;
        }

        return {
            id: profile[0].ID,
            type: profileType
        };
    }

    static getAvatar(avatar) {
        if (!avatar) return null;
        if (typeof avatar === 'string') {
            try {
                return JSON.parse(avatar);
            } catch {
                return null;
            }
        }
        return avatar;
    }

    static getCover(cover) {
        if (!cover) return null;
        if (typeof cover === 'string') {
            try {
                return JSON.parse(cover);
            } catch {
                return null;
            }
        }
        return cover;
    }

    async getAuthorData(uid) {
        const account = await dbQueryE('SELECT * FROM `accounts` WHERE `ID` = ?', [uid]);

        if (!account || account.length === 0) {
            return false;
        }

        return {
            id: account[0].ID,
            name: account[0].Name,
            username: account[0].Username,
            avatar: AccountDataHelper.getAvatar(account[0].Avatar)
        }
    }

    async getAuthorDataFromPost(postID) {
        try {
            const posts = await dbQueryE('SELECT * FROM posts WHERE ID = ?', [postID]);

            if (!posts || posts.length === 0) {
                return false;
            }

            const postData = posts[0];

            let authorQuery;
            if (postData.author_type === 0) {
                authorQuery = 'SELECT * FROM accounts WHERE ID = ?';
            } else if (postData.author_type === 1) {
                authorQuery = 'SELECT * FROM channels WHERE ID = ?';
            } else {
                return false;
            }

            const author = await dbQueryE(authorQuery, [postData.author_id]);
            if (!author || author.length === 0) {
                return false;
            }

            return {
                type: postData.author_type,
                data: JSON.parse(JSON.stringify(author[0])),
            };
        } catch (error) {
            console.error('Ошибка в getAuthorDataFromPost:', error);
            return false;
        }
    }

    async getIcons(uid) {
        const icons = [];
        const accountManager = new AccountManager(uid);
        const res = await dbQueryE('SELECT * FROM `icons` WHERE `UserID` = ?', [uid]);
        const status = await accountManager.getGoldStatus();
        if (status && status.activated) {
            icons.push({
                icon_id: 'GOLD',
                date_get: status.date_get
            });
        }

        icons.push(...res.map(icon => ({
            icon_id: icon.IconID,
            date_get: icon.Date
        })));

        return icons;
    }

    async checkBlock(uid, a_id, a_type) {
        const result = await dbQueryE('SELECT * FROM `blocked` WHERE `uid` = ? AND `author_id` = ? AND `author_type` = ?', [uid, a_id, a_type]);
        return result.length > 0;
    }

    async checkSubscription(uid, data) {
        const result = await dbQueryE(
            'SELECT * FROM `subscriptions` WHERE `User` = ? AND `Target` = ? AND `TargetType` = ?',
            [uid, data.id, data.type]
        );
        return result.length > 0;
    }
}

export default AccountDataHelper;