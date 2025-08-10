import { dbQueryE } from '../../system/global/DataBase.js';
// import AccountManager from '../account/AccountManager.js';
import AppError from '../system/AppError.js';

class PostInteraction {
    private pid: number;
    // private accountData: any;
    private postData: any;
    // private accountManager: AccountManager;
    private initPromise: Promise<void>;

    constructor(uid: number, pid: number) {
        if (!Number.isInteger(uid) || uid <= 0) {
            throw new AppError('Неверный идентификатор пользователя');
        }
        if (!Number.isInteger(pid) || pid <= 0) {
            throw new AppError('Неверный идентификатор поста');
        }

        this.pid = pid;
        // this.accountData = {};
        this.postData = {};
        // this.accountManager = new AccountManager(uid);
        this.initPromise = this.init();
    }

    async init() {
        // this.accountData = await this.accountManager.getAccountData();

        this.postData = await this.loadPost(this.pid);

        if (!this.postData) {
            throw new AppError('Пост не найден');
        }
    }

    async ensureInitialized() {
        await this.initPromise;
    }

    async loadPost(pid: number) {
        const posts = await dbQueryE('SELECT * FROM `posts` WHERE `ID` = ?', [pid]);

        if (posts.length === 0) {
            return null;
        }
        return posts[0];
    }
}

export default PostInteraction;