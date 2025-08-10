import PostManager from '../../../../services/posts/PostManager.js';

const add = async ({ account, data }) => {
    const { text, files, type, wall, from } = data.payload;

    const post = await PostManager.create({ account, payload: { text, files, type, wall, from } });

    return post;
}

export default add;
