import { useTranslation } from 'react-i18next';
import { PreloadPosts } from '../../../System/UI/Preload';
import { useAuth } from '../../../System/Hooks/useAuth';
import Post from '../../../Components/Post';
import AddPost from '../../../UIKit/Components/Layout/AddPost';

const Posts = ({ profileData, posts, postsLoaded, morePostsLoading, allPostsLoaded, postsEndRef, onSend }) => {
    const { accountData } = useAuth();
    const { t } = useTranslation();

    return (
        <>
            {accountData && accountData.id ? (
                <>
                    {
                        profileData.my_profile === true && (
                            <AddPost
                                onSend={onSend}
                                inputPlaceholder={t('post_text_input')}
                            />
                        )
                    }
                    {
                        postsLoaded ? (
                            posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <Post
                                        key={post.id}
                                        post={post}
                                    />
                                ))
                            ) : (
                                <div className="UI-ErrorMessage">{t('ups')}</div>
                            )
                        ) : (
                            <PreloadPosts />
                        )
                    }

                </>
            ) : (
                <div className="UI-ErrorMessage">Для просмотра постов нужно иметь аккаунт</div>
            )}
            {
                !morePostsLoading && postsLoaded && posts.length > 0 && !allPostsLoaded && (
                    <span ref={postsEndRef} />
                )
            }
            {
                postsLoaded && morePostsLoading && (
                    <div className="UI-Loading">
                        <div className="UI-Loader_1"></div>
                    </div>
                )
            }
        </>
    )
}

export default Posts;