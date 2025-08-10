import AccountManager from '../../../services/account/AccountManager.js';
import AccountDataHelper from '../../../services/account/AccountDataHelper.js';
import { dbQueryE } from '../../../system/global/DataBase.js';
import { getSession } from '../../../system/global/AccountManager.js';
import RouterHelper from '../../../services/system/RouterHelper.js';

export const getProfile = async ({ account, data }) => {
    if (!data.username && !data.uid) {
        return RouterHelper.sendError('Профиль не найден');
    }

    let profileType = [0, 'user'];
    let profile;

    if (data.username) {
        profile = await dbQueryE('SELECT * FROM `accounts` WHERE `Username` = ?', [data.username]);
        profile = profile[0] || null;

        if (!profile) {
            profile = await dbQueryE('SELECT * FROM `channels` WHERE `Username` = ?', [data.username]);
            profile = profile[0] || null;
            profileType = [1, 'channel'];
        }
    } else if (data.uid) {
        profile = await dbQueryE('SELECT * FROM `accounts` WHERE `ID` = ?', [data.uid]);
        profile = profile[0] || null;
    }

    if (!profile) {
        return RouterHelper.sendError('Профиль не найден');
    }

    if (profile.Posts === 0) {
        const result = await dbQueryE('SELECT COUNT(*) AS Count FROM `posts` WHERE `author_id` = ? AND `author_type` = ?', [profile.ID, profileType[0]]);
        profile.Posts = result[0]?.Count || 0;

        const updateQuery = profileType[0] === 0
            ? 'UPDATE `accounts` SET `Posts` = ? WHERE `ID` = ?'
            : 'UPDATE `channels` SET `Posts` = ? WHERE `ID` = ?';

        await dbQueryE(updateQuery, [profile.Posts, profile.ID]);
    }

    let links = null;
    if (profile.Links > 0) {
        links = await dbQueryE('SELECT * FROM `accounts_links` WHERE `UserID` = ? ORDER BY `Date` DESC', [profile.ID]);
        links = links.map(link => ({
            id: link.ID,
            title: link.Title,
            link: link.Link
        }));
    }

    let myProfile = false;
    let subscribed = false;
    const accountDataHelper = new AccountDataHelper();

    if (account) {
        if (profileType[0] === 0) {
            myProfile = account.ID === profile.ID;
        } else if (profileType[0] === 1) {
            myProfile = account.ID === profile.Owner;
        }
        subscribed = await accountDataHelper.checkSubscription(account.ID, {
            type: profileType[0],
            id: profile.ID
        });
    }

    const isBlocked = (account && account.ID !== profile.ID) ? await accountDataHelper.checkBlock(account.ID, profile.ID, profileType[0]) : false;

    const profileData: any = {
        type: profileType[1],
        id: profile.ID,
        name: profile.Name,
        username: profile.Username,
        cover: AccountDataHelper.getCover(profile.Cover),
        avatar: AccountDataHelper.getAvatar(profile.Avatar),
        description: profile.Description,
        posts: profile.Posts,
        subscribers: profile.Subscribers,
        subscribed,
        create_date: profile.CreateDate,
        blocked: isBlocked,
        my_profile: myProfile
    };

    if (profileType[0] === 0) {
        const manager = new AccountManager(profile.ID);
        const permissions = await manager.getPermissions();
        const session = await getSession(profile.ID);

        profileData.online = (session && session.connection) ? true : false;
        profileData.icons = await accountDataHelper.getIcons(profile.ID) || null;
        profileData.subscriptions = profile.Subscriptions;
        profileData.links_count = profile.Links;
        profileData.links = links;
        profileData.permissions = (
            permissions ? {
                posts: permissions.Posts,
                comments: permissions.Comments,
                new_chats: permissions.NewChats,
                music_upload: permissions.MusicUpload
            } : null
        );
    }

    return RouterHelper.sendAnswer({
        data: profileData
    });
}

const getProfileTypeData = async (username) => {
    let profile = await dbQueryE('SELECT * FROM `accounts` WHERE `Username` = ?', [username]);

    if (profile.length > 0) {
        return [profile[0].ID, 0];
    } else {
        profile = await dbQueryE('SELECT * FROM `channels` WHERE `Username` = ?', [username]);

        if (profile.length > 0) {
            return [profile[0].ID, 1];
        } else {
            return undefined;
        }
    }
}

export const blockProfile = async ({ account, data }) => {
    if (!account) { return };

    const profileData = await getProfileTypeData(data.username);

    if (!profileData) {
        return RouterHelper.sendError('Профиль не найден');
    }

    const accountManager = new AccountManager(account.ID);
    await accountManager.blockProfile(profileData[0], profileData[1]);

    return RouterHelper.sendAnswer({
        message: 'Профиль заблокирован'
    });
}

export const unblockProfile = async ({ account, data }) => {
    if (!account) { return };

    const profileData = await getProfileTypeData(data.username);

    if (!profileData) {
        return RouterHelper.sendError('Профиль не найден');
    }
    
    const accountManager = new AccountManager(account.ID);
    await accountManager.unblockProfile(profileData[0], profileData[1]);

    return RouterHelper.sendAnswer({
        message: 'Профиль разблокирован'
    });
}