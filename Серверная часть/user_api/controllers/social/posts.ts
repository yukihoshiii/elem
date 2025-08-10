import AccountDataHelper from '../../../services/account/AccountDataHelper.js';
import PostDataHelper from '../../../services/posts/PostsDataHelper.js';
import RouterHelper from '../../../services/system/RouterHelper.js';
import { dbQueryE } from '../../../system/global/DataBase.js';

const handlePost = async (post, account) => {
    let myPost = false;

    const accountDataHelper = new AccountDataHelper();
    const postDataHelper = new PostDataHelper(post.id);
    const author = await accountDataHelper.getAuthorDataFromPost(post.id);
    const userIcons = [];
    const isBlocked = account ? await accountDataHelper.checkBlock(account.ID, post.author_id, post.author_type) : false;

    if (!author) { return }

    if (account) {
        if (parseInt(author.type, 10) === 0 && author.data.ID === account.ID) {
            myPost = true;
        }
        if (parseInt(author.type, 10) === 1 && author.data.Owner === account.ID) {
            myPost = true;
        }
    }

    if (parseInt(author.type, 10) === 0) {
        userIcons.push(...await accountDataHelper.getIcons(author.data.ID));
    }

    return {
        id: post.id,
        author: {
            id: author.data.ID,
            type: author.type,
            username: author.data.Username,
            name: author.data.Name,
            avatar: AccountDataHelper.getAvatar(author.data.Avatar),
            icons: userIcons,
            blocked: isBlocked
        },
        text: post.text,
        content: JSON.parse(post.content) ?? [],
        create_date: post.date,
        likes: post.likes,
        dislikes: post.dislikes,
        ...(account ? {
            liked: await postDataHelper.postLiked(account.ID),
            disliked: await postDataHelper.postDisliked(account.ID),
        } : {
            liked: false,
            disliked: false
        }),
        comments: post.comments,
        my_post: myPost
    };
}

const loadPostsProfile = async ({ account, authorID, authorType, start_index }) => {
    const posts = await dbQueryE('SELECT * FROM `posts` WHERE `author_id` = ? AND `author_type` = ? AND `hidden` = 0 ORDER BY `date` DESC LIMIT ?, 25', [authorID, authorType, start_index]);

    const handledPosts = await Promise.all(
        posts.map(post => handlePost(post, account))
    );

    return RouterHelper.sendAnswer({
        posts: handledPosts
    })
}

const loadPostsSub = async ({ account, start_index }) => {
    const query = `
    SELECT posts.* FROM posts
    JOIN subscriptions ON posts.author_id = subscriptions.Target AND posts.author_type = subscriptions.TargetType
    LEFT JOIN accounts ON posts.author_id = accounts.ID AND posts.author_type = 0
    LEFT JOIN channels ON posts.author_id = channels.ID AND posts.author_type = 1
    WHERE subscriptions.User = ?
    AND posts.hidden = 0 
    ORDER BY posts.date DESC
    LIMIT ?, 25
    `;
    const posts = await dbQueryE(query, [account.ID, start_index]);

    const handledPosts = await Promise.all(
        posts.map(post => handlePost(post, account))
    );

    return RouterHelper.sendAnswer({
        posts: handledPosts
    })
}

const loadPostsRec = async ({ account, start_index }) => {
    const query = 'SELECT * FROM `posts` WHERE `hidden` = 0 ORDER BY RAND() DESC LIMIT ?, 25';
    const posts = await dbQueryE(query, [start_index]);

    const handledPosts = await Promise.all(
        posts.map(post => handlePost(post, account))
    );

    return RouterHelper.sendAnswer({
        posts: handledPosts
    })
}

const loadPostsLast = async ({ account, start_index }) => {
    const query = `
        SELECT p.* 
        FROM posts p
        LEFT JOIN blocked b 
            ON b.author_id = p.author_id 
            AND b.author_type = p.author_type 
            AND b.uid = ?
        WHERE p.hidden = 0 
          AND b.author_id IS NULL
        ORDER BY p.Date DESC
        LIMIT ?, 25`;
    const posts = await dbQueryE(query, [account.ID, start_index]);

    const handledPosts = await Promise.all(
        posts.map(post => handlePost(post, account))
    );

    return RouterHelper.sendAnswer({
        posts: handledPosts
    })
}

const loadPostsWall = async ({ account, username, start_index }) => {
    const authorData = await AccountDataHelper.getDataFromUsername(username);

    if (!authorData) {
        return RouterHelper.sendError('Стенка не найдена');
    }

    const query = `
    SELECT posts.*
    FROM wall
    INNER JOIN posts ON wall.pid = posts.id
    WHERE wall.author_id = ? AND wall.author_type = ?
    ORDER BY posts.date DESC
    LIMIT ?, 25
    `;
    const wallPosts = await dbQueryE(query, [authorData.id, authorData.type, start_index]);

    const posts = [];
    for (const post of wallPosts) {
        posts.push(await handlePost(post, account));
    }

    return RouterHelper.sendAnswer({
        posts_type: 'wall',
        posts: posts
    })
}

export const loadPost = async ({ account, data }) => {
    const post = await dbQueryE('SELECT * FROM `posts` WHERE `id` = ?', [data.pid]);

    if (!post?.[0]?.id) {
        return RouterHelper.sendError('Пост не найден');
    }

    return RouterHelper.sendAnswer({
        post: await handlePost(post[0], account)
    })
}

export const loadPosts = async ({ account, data }) => {
    const { posts_type, author_id, author_type, start_index, username } = data.payload;

    switch (posts_type) {
        case 'profile':
            return await loadPostsProfile({
                account,
                authorID: author_id,
                authorType: author_type,
                start_index: start_index || 0
            })
        case 'subscribe':
            return await loadPostsSub({
                account,
                start_index: start_index || 0
            })
        case 'rec':
            return await loadPostsRec({
                account,
                start_index: start_index || 0
            })
        case 'last':
            return await loadPostsLast({
                account,
                start_index: start_index || 0
            })
        case 'wall':
            return await loadPostsWall({
                account,
                username: username,
                start_index: start_index || 0
            })
        default:
            return RouterHelper.sendError('Ошибка при выводе постов');
    }
}