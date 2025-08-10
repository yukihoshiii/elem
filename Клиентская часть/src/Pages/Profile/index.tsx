import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { TopBar } from '../../Components/Navigate';
import ErrorPage from '../ErrorPage';
import { Window } from '../../System/Elements/Modal';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { Tabs } from '../../System/Modules/UIKit';
import { useWebSocket } from '../../System/Context/WebSocket';
import ChangeChannel from './Components/ChangeChannel';
import Header from './Components/Header';
import Info from './Components/Info';
import Posts from './Components/Posts';
import Wall from './Components/Wall';

const Profile = () => {
    const { wsClient } = useWebSocket();
    const { t } = useTranslation();
    const params = useParams();
    const username = params.username;
    const postsRef = useRef<HTMLDivElement>(null);

    const [profileHidden, setProfileHidden] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<any>({});
    const [profileLoaded, setProfileLoaded] = useState<boolean>(false);

    const [postsLoaded, setPostsLoaded] = useState<boolean>(false);
    const [posts, setPosts] = useState<any>([]);
    const [postsSI, setPostsSI] = useState<number>(0);
    const [morePostsLoading, setMorePostsLoading] = useState<boolean>(false);
    const [allPostsLoaded, setAllPostsLoaded] = useState<boolean>(false);

    const [windowOpen, setWindowOpen] = useState<boolean>(false);
    const [windowTitle, setWindowTitle] = useState<string>('');
    const [windowContent, setWindowContent] = useState<string>('');

    const [changeChannelOpen, setChangeChannelOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState(0);

    const { ref: postsEndRef, inView: postsEndIsView } = useInView({
        threshold: 0
    });

    const addNewPosts = (newPosts) => {
        setPosts((prevPosts) => {
            const mergedPosts = [...prevPosts, ...newPosts];

            return mergedPosts.reduce((acc, post) => {
                if (!acc.some((p) => p.id === post.id)) {
                    acc.push(post);
                }
                return acc;
            }, []);
        });
    };

    const loadProfile = (username) => {
        wsClient.send({
            type: 'social',
            action: 'get_profile',
            username: username
        }).then((res) => {
            const profile = res;

            if (profile.status === 'success') {
                let uid = profile.data.id;
                let targetType = profile.data.type === 'user' ? 0 : 1;
                if (uid) {
                    setProfileData(profile.data);
                    if (profile.data.posts > 0) {
                        wsClient.send({
                            type: 'social',
                            action: 'load_posts',
                            payload: {
                                posts_type: 'profile',
                                author_id: profile.data.id,
                                author_type: targetType,
                                start_index: 0
                            }
                        }).then((res) => {
                            if (res.posts && res.posts.length > 0) {
                                addNewPosts(res.posts);
                                setPostsSI(25);
                            }
                            setPostsLoaded(true);
                        })
                    } else {
                        setPostsLoaded(true);
                    }
                }
            }

            setProfileLoaded(true);
        })
    }

    const updateProfile = () => {
        loadProfile(params.username);
    }

    const onSend = () => {
        setPostsSI(0);
        const targetType = profileData.type === 'user' ? 0 : 1;
        wsClient.send({
            type: 'social',
            action: 'load_posts',
            payload: {
                posts_type: 'profile',
                author_id: profileData.id,
                author_type: targetType,
                start_index: 0
            }
        }).then((res) => {
            if (res.posts && res.posts.length > 0) {
                setPosts(res.posts);
                setPostsSI(25);
            }
            setPostsLoaded(true);
        })
    }

    const tabs = [
        {
            title: t('profile_posts'),
            content: <Posts
                profileData={profileData}
                postsLoaded={postsLoaded}
                posts={posts}
                morePostsLoading={morePostsLoading}
                allPostsLoaded={allPostsLoaded}
                postsEndRef={postsEndRef}
                onSend={onSend}
            />
        },
        {
            title: t('profile_wall'),
            content: <Wall profileData={profileData} />
        },
        {
            title: t('profile_info'),
            content: <Info profileData={profileData} />
        }
    ]

    useEffect(() => {
        if (profileLoaded) {
            setProfileData({});
            setProfileLoaded(false);
            setPosts([]);
            setPostsLoaded(false);
            setMorePostsLoading(false);
            setAllPostsLoaded(false);
            setPostsSI(0);
        }
        loadProfile(username);
    }, [username])

    useEffect(() => {
        const handleScroll = () => {
            if (postsRef.current && postsRef.current.scrollTop > 250) {
                setProfileHidden(true);
            } else {
                setProfileHidden(false);
            }
        };
        const element = postsRef.current;
        if (element) {
            element.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (element) {
                element.removeEventListener('scroll', handleScroll);
            }
        };
    }, [])

    useEffect(() => {
        if (postsEndIsView && profileLoaded) {
            setMorePostsLoading(true);
            const targetType = profileData.type === 'user' ? 0 : 1;
            wsClient.send({
                type: 'social',
                action: 'load_posts',
                payload: {
                    posts_type: 'profile',
                    author_id: profileData.id,
                    author_type: targetType,
                    start_index: postsSI
                }
            }).then((res) => {
                if (res.posts && res.posts.length > 0) {
                    addNewPosts(res.posts);
                    setPostsSI(prevPostsSI => prevPostsSI + 25);
                } else {
                    setAllPostsLoaded(true);
                }
                setMorePostsLoading(false);
            })
        }
    }, [postsEndIsView]);

    return (
        <>
            <TopBar search={true} />
            <div className="Content Profile-Page">
                {
                    profileLoaded && !profileData.id ? (
                        <ErrorPage />
                    ) : (
                        <>
                            <Header
                                profileData={profileData}
                                profileLoaded={profileLoaded}
                                profileHidden={profileHidden}
                                setChangeChannelOpen={setChangeChannelOpen}
                                setWindowTitle={setWindowTitle}
                                setWindowContent={setWindowContent}
                                setWindowOpen={setWindowOpen}
                            />
                            <div className="UI-C_R Profile-Posts">
                                <div ref={postsRef} className="UI-ScrollView">
                                    <div className="Posts" style={{ marginBottom: 20 }}>
                                        <Tabs
                                            tabs={tabs}
                                            select={setActiveTab}
                                            className="UI-B_FIRST"
                                        />
                                        {tabs[activeTab]?.content}
                                    </div>
                                </div>
                            </div>
                            <Window
                                title="Изменить канал"
                                content={
                                    <ChangeChannel
                                        profileData={profileData}
                                        updateData={updateProfile}
                                    />
                                }
                                contentClass="MultiForm"
                                style={{ width: 'fit-content' }}
                                isOpen={changeChannelOpen}
                                setOpen={setChangeChannelOpen}
                            />
                            <Window title={windowTitle} content={windowContent} style={{ maxWidth: 400 }} contentStyle={{ height: '50vh' }} isOpen={windowOpen} setOpen={setWindowOpen} />
                        </>
                    )
                }
            </div>
        </>
    )
};

export default Profile;
