import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../System/Hooks/useAuth';
import { AnimatePresence, motion } from 'framer-motion';
import { PlayButton } from '../../../System/Elements/MusicPlayer';
import BaseConfig from '../../../Configs/Base';
import { MusicCover } from '../../../UIKit';

const UserContentSong = ({ song }) => {
    const { accountData } = useAuth();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [data, setData] = useState([]);

    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState('0:00');
    const [currentDuration, setCurrentDuration] = useState('0:00');
    const [progress, setProgress] = useState(0);
    const volume = () => {
        const savedVolume = localStorage.getItem('M-Volume');
        return savedVolume ? parseFloat(savedVolume) * 100 : 100;
    }

    const animations = {
        show: {
            opacity: 1,
            marginTop: 5,
            height: 'auto',
            transition: {
                duration: 0.1,
            },
        },
        hide: {
            opacity: 0,
            height: 0,
            marginTop: 0,
            transition: {
                duration: 0.1,
            },
        }
    };

    useEffect(() => {
        if (accountData.ID) {
        } else {
            setDataLoaded(true);
        }
    }, [])

    useEffect(() => {
        if (!dataLoaded || !data.ID) return;

        const player = playerRef.current;
        player.volume = volume() / 100;

        const updateDuration = () => {
            setDuration(player.duration);
        };

        player.addEventListener('loadedmetadata', updateDuration);
        return () => {
            player.removeEventListener('loadedmetadata', updateDuration);
        };
    }, [dataLoaded])

    useEffect(() => {
        if (!isPlaying) return;

        const player = playerRef.current;

        const updateProgress = () => {
            setCurrentDuration(player.currentTime);
            setProgress((player.currentTime / player.duration) * 100);
        };

        player.addEventListener('timeupdate', updateProgress);

        return () => {
            player.removeEventListener('timeupdate', updateProgress);
        };
    }, [isPlaying]);


    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        if (isPlaying) {
            playerRef.current.pause();
        } else {
            playerRef.current.play();
        }
    }

    const playerChangeTime = (event) => {
        const percent = event.nativeEvent.offsetX / event.currentTarget.offsetWidth;
        const player = playerRef.current;
        player.currentTime = percent * player.duration;
    };
    const playerHandleEnd = () => {
        const player = playerRef.current;
        player.currentTime = 0;
        if (isPlaying) {
            setIsPlaying(false);
        }
    }

    return (
        <div className="Music" style={{ height: dataLoaded ? 'auto' : 60 }}>
            {
                dataLoaded ? (
                    <>
                        <MusicCover cover={data.Cover} width={60} borderRadius={5} shadows={false} />
                        {
                            accountData && accountData.id ? (
                                data && data.ID ? (
                                    <>
                                        <div className="Player">
                                            <div className="Metadata">
                                                <div className="Title">{data.Title}</div>
                                                <div className="Artist">{data.Artist}</div>
                                            </div>
                                            <AnimatePresence>
                                                {
                                                    isPlaying && (
                                                        <motion.div
                                                            className="SliderContainer"
                                                            initial="hide"
                                                            animate="show"
                                                            exit="hide"
                                                            variants={animations}
                                                        >
                                                            <div className="Time">{currentDuration}</div>
                                                            <div onClick={(e) => playerChangeTime(e)} className="UI-Slider">
                                                                <div style={{ width: `${progress}%` }} className="Progress"></div>
                                                            </div>
                                                            <div className="Time">{duration}</div>
                                                        </motion.div>
                                                    )
                                                }
                                            </AnimatePresence>
                                        </div>
                                        <PlayButton isPlaying={isPlaying} togglePlay={togglePlay} />
                                        <audio
                                            ref={playerRef}
                                            onEnded={playerHandleEnd}
                                            src={`${BaseConfig.domains.cdn}/Content/Music/Files/${data.File}`}
                                        ></audio>
                                    </>
                                ) : (
                                    <div className="Error">Тут что-то было?</div>
                                )
                            ) : (
                                <div className="Error">Создайте аккаунт, чтобы слушать</div>
                            )
                        }
                    </>
                ) : (
                    <div className="UI-PRELOAD"></div>
                )
            }
        </div>
    );
}

export default UserContentSong;