import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I_FULLSCREEN, I_PLAY, I_SETTINGS, I_VOLUME_MINUS, I_VOLUME_PLUS } from '../../../System/UI/IconPack';
import { HandleTime, PlayButton } from '../../../System/Elements/MusicPlayer';
import BaseConfig from '../../../Configs/Base';
import { Slider } from '../../../UIKit';

const UserContentVideo = ({ video }) => {
    const { t } = useTranslation();
    const [isHover, setIsHover] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [volume, setVolume] = useState(() => {
        const savedVolume = localStorage.getItem('V-Volume');
        return savedVolume ? savedVolume : 1;
    });
    const playerRef = useRef(null);
    const videoRef = useRef(null);
    const timerRef = useRef(null);
    const variants = {
        hidden: {
            opacity: 0,
            filter: 'blur(3px)'
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)'
        }
    };

    const togglePlay = () => {
        const video = videoRef.current;
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
    };

    const changeTime = (newTime) => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const changeVolume = (newVolume) => {
        setVolume(newVolume);
        localStorage.setItem('V-Volume', newVolume);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const handleFullscreen = () => {
        if (!isFullscreen) {
            if (playerRef.current.requestFullscreen) {
                playerRef.current.requestFullscreen();
            } else if (playerRef.current.mozRequestFullScreen) { // Firefox
                playerRef.current.mozRequestFullScreen();
            } else if (playerRef.current.webkitRequestFullscreen) { // Chrome, Safari, Opera
                playerRef.current.webkitRequestFullscreen();
            } else if (playerRef.current.msRequestFullscreen) { // IE/Edge
                playerRef.current.msRequestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.volume = volume;
        }
    });

    useEffect(() => {
        const onFullscreenChange = () => {
            if (
                !document.fullscreenElement &&
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement &&
                !document.msFullscreenElement
            ) {
                setIsFullscreen(false);
            } else {
                setIsFullscreen(true);
            }
        };

        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);
        document.addEventListener('mozfullscreenchange', onFullscreenChange);
        document.addEventListener('MSFullscreenChange', onFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
            document.removeEventListener('mozfullscreenchange', onFullscreenChange);
            document.removeEventListener('MSFullscreenChange', onFullscreenChange);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleMouseOver = () => {
        setIsHover(true);
        resetTimer();
    };

    const handleMouseLeave = () => {
        setIsHover(false);
        resetTimer();
    };

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (!settingsOpen) {
            timerRef.current = setTimeout(() => {
                setIsHover(false);
            }, 2000);
        }
    };

    return (
        <div
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            ref={playerRef}
            className="UserContent-Video"
        >
            <video
                ref={videoRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                controls={false}
                src={`${BaseConfig.domains.cdn}/Content/Posts/Video/${video.file_name}`}
                style={{ maxHeight: isFullscreen ? '100%' : '' }}
                onEnded={handleEnded}
            />
            <AnimatePresence>
                {
                    !isPlaying && (
                        <motion.div
                            className="VideoInfo"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <I_PLAY />
                            {t('video')}
                        </motion.div>
                    )
                }
                {
                    (settingsOpen && isHover) && (
                        <motion.div
                            className="Settings"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ duration: 0.3, ease: [0.43, 0.13, 0.28, 0.96] }}
                        >
                            <div className="Volume">
                                <I_VOLUME_MINUS />
                                <Slider
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={volume}
                                    onChange={changeVolume}
                                />
                                <I_VOLUME_PLUS />
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
            <motion.div
                className="Blur"
                variants={variants}
                initial="hidden"
                animate={isHover ? 'visible' : 'hidden'}
            >
            </motion.div>
            <motion.div
                className="Controls"
                variants={variants}
                initial="hidden"
                animate={isHover ? 'visible' : 'hidden'}
            >
                <PlayButton isPlaying={isPlaying} togglePlay={togglePlay} />
                <div className="Slider">
                    <Slider
                        value={currentTime}
                        max={duration}
                        onChange={changeTime}
                    />
                    <div className="Duration">
                        <div>
                            <HandleTime time={currentTime} />
                        </div>
                        <div>
                            <HandleTime time={duration} />
                        </div>
                    </div>
                </div>
                <button className="SettingsButton" onClick={() => { setSettingsOpen(!settingsOpen) }}>
                    <I_SETTINGS />
                </button>
                <button className="FullscreenButton" onClick={handleFullscreen}>
                    <I_FULLSCREEN />
                </button>
            </motion.div>
        </div>
    );
};

export default UserContentVideo;
