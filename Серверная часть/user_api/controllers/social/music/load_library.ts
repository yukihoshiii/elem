import AccountDataHelper from '../../../../services/account/AccountDataHelper.js';
import { dbQueryE } from '../../../../system/global/DataBase.js';

const load_library = async ({ account }) => {
    const playlists = [];
    
    const likes = await dbQueryE('SELECT * FROM `music_likes` WHERE `type` = 1 AND `uid` = ?', [account.ID]);
    
    for (const like of likes) {
        const playlistRows = await dbQueryE('SELECT * FROM playlists WHERE id = ?', [like.target_id]);
        const accountDataHelper = new AccountDataHelper();

        const author = await accountDataHelper.getAuthorData(playlistRows[0].owner);
        
        if (playlistRows.length > 0) {
            const pl = playlistRows[0];
            playlists.push({
                id: pl.id,
                type: 1,
                title: pl.name,
                author: author,
                add_date: like.date
            });
        }
    }

    return {
        status: 'success',
        playlists
    };
};

export default load_library;