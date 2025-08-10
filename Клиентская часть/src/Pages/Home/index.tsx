import { useEffect, useRef, useState } from 'react';
import { PreloadPosts } from '../../System/UI/Preload';
import { useInView } from 'react-intersection-observer';
import GoldUsers from '../../System/Elements/GoldUsers';
import { useTranslation } from 'react-i18next';
import Update from './Components/Update';
import { DefaultBanner } from '../../Components/Ad';
import OnlineUsers from './Components/OnlineUsers';
import { useWebSocket } from '../../System/Context/WebSocket';
import { useAuth } from '../../System/Hooks/useAuth';
import Post from '../../Components/Post';
import AddPost from '../../UIKit/Components/Layout/AddPost';

interface Post {
    id: string;
    author: {
        username: string;
        name: string;
        avatar: string;
        icons?: any;
        blocked?: boolean;
    };
    create_date: string;
}

const Home = () => {
    const { wsClient } = useWebSocket();
    const { t } = useTranslation();
    const { isSocketAuthorized } = useAuth();
    const postsRef = useRef(null);
    const [postsLoaded, setPostsLoaded] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [postsCategory, setPostsCategory] = useState<string>(
        localStorage.getItem('S-PostsType') || 'last'
    );
    const [postsSI, setPostsSI] = useState(25);
    const [morePostsLoading, setMorePostsLoading] = useState(false);

    const addNewPosts = (newPosts: Post[]) => {
        setPosts((prevPosts) => {
            const mergedPosts = [...prevPosts, ...newPosts];

            return mergedPosts.reduce((acc, post) => {
                if (!acc.some((p) => p.id === post.id)) {
                    acc.push(post);
                }
                return acc;
            }, [] as Post[]);
        });
    };

    useEffect(() => {
        if (isSocketAuthorized) {
            loadPosts({ type: postsCategory, startIndex: 0 }).then((data) => {
                setPostsLoaded(true);
                setPosts(data);
            })
        }
    }, [isSocketAuthorized]);

    const handleDeletePost = (data: any, id: string) => {
        if (data.status == 'success') {
            const updatedPosts = posts.filter((post) => post.id !== id);
            setPosts(updatedPosts);
        }
    };

    const loadPosts = async ({ type, startIndex }: { type: string, startIndex: number }): Promise<Post[]> => {
        try {
            const data = await wsClient.send({
                type: 'social',
                action: 'load_posts',
                payload: {
                    posts_type: type,
                    start_index: startIndex
                }
            });

            if (Array.isArray(data.posts) && data.posts.length > 0) {
                return data.posts;
            }
        } catch (error) {
            console.error('Ошибка загрузки постов:', error);
            return [];
        }
        return [];
    };

    const onSend = () => {
        setPostsSI(0);
        loadPosts({ type: postsCategory, startIndex: 0 }).then((posts) => {
            setPostsLoaded(true);
            setPosts(posts);
        })
    }

    const selectPostsCategory = (category: string) => {
        if (postsCategory !== category) {
            setPostsCategory(category);
            loadPosts({ type: category, startIndex: 0 }).then((data) => {
                setPosts(data);
            })
        }
    };

    const { ref: postsEndRef, inView: postsEndIsView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (postsEndIsView) {
            setMorePostsLoading(true);
            setPostsSI(postsSI + 25);
            loadPosts({ type: postsCategory, startIndex: postsSI }).then((data) => {
                addNewPosts(data);
                setPostsSI((prevPostsSI) => prevPostsSI + 25);
                setMorePostsLoading(false);
            })
        }
    }, [postsEndIsView]);

    return (
        <>
            <div className="UI-C_L">
                <div ref={postsRef} className="UI-ScrollView">
                    <OnlineUsers />
                    <AddPost
                        onSend={onSend}
                        inputPlaceholder={t('post_text_input')}
                    />
                    <div className="UI-Tabs">
                        <button
                            onClick={() => {
                                selectPostsCategory('last');
                            }}
                            className={`Tab${postsCategory === 'last' ? ' ActiveTab' : ''}`}
                        >
                            {t('category_last')}
                        </button>
                        <button
                            onClick={() => {
                                selectPostsCategory('rec');
                            }}
                            className={`Tab${postsCategory === 'rec' ? ' ActiveTab' : ''}`}
                        >
                            {t('category_recommended')}
                        </button>
                        <button
                            onClick={() => {
                                selectPostsCategory('subscribe');
                            }}
                            className={`Tab${postsCategory === 'subscribe' ? ' ActiveTab' : ''}`}
                        >
                            {t('category_subscriptions')}
                        </button>
                    </div>
                    <div className="Posts">
                        {postsLoaded ? (
                            Array.isArray(posts) && posts.length > 0 ? (
                                <>
                                    {posts
                                        .filter((post) => post !== null && post !== undefined)
                                        .map((post) => (
                                            <Post
                                                key={`PID-${post.id}`}
                                                post={post}
                                                onDelete={handleDeletePost}
                                                profileData={null}
                                                className=""
                                            />
                                        ))}
                                    {posts.length > 24 && !morePostsLoading && <span ref={postsEndRef} />}
                                    {posts.length > 24 && morePostsLoading && (
                                        <div className="UI-Loading">
                                            <div className="UI-Loader_1"></div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="UI-ErrorMessage">{t('ups')}</div>
                            )
                        ) : (
                            <PreloadPosts />
                        )}
                    </div>
                </div>
            </div>
            <div className="UI-C_R">
                <div className="UI-ScrollView">
                    <Update />
                    <DefaultBanner />
                    <div className="UI-Block">
                        <div className="UI-Title" style={{ width: '100%' }}>
                            {t('gold_users_list_1')}
                        </div>
                        <div className="GoldSub-Users">
                            <GoldUsers />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;