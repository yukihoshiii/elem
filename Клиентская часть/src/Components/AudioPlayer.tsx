import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDuration, setCurrentTime, setPlay, nextSong, prevSong } from '../Store/Slices/musicPlayer.ts';
import { useWebSocket } from '../System/Context/WebSocket.jsx';
import { useModal } from '../System/Context/Modal.jsx';
import { useDatabase } from '../System/Context/Database.tsx';

const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const dispatch = useDispatch();
    const { songData, playing, loop, desiredTime, volume, currentSongIndex, songsQueue } = useSelector((state: any) => state.musicPlayer);
    const [loading, setLoading] = useState(false);
    const { wsClient } = useWebSocket();
    const { openModal } = useModal();
    const db = useDatabase();

    const download = async () => {
        let objectUrl: string | null = null;

        const res: any = await wsClient.send({
            type: 'download',
            action: 'music',
            song_id: songData.id
        });

        if (res.status === 200) {
            const { binary, mime } = res.file;
            const blob = new Blob([binary], { type: mime });

            await db.music_cache.put({
                song_id: songData.id,
                file_blob: blob
            });

            objectUrl = URL.createObjectURL(blob);

            setLoading(false);

            return objectUrl;
        } else {
            openModal({ type: 'error', title: 'Ошибка', text: res.message });
        }
    }

    const loadTrack = async () => {
        setLoading(true);
        try {
            const cached = await db.music_cache.get(songData.id);

            if (cached) {
                const blob = cached.file_blob;
                const url = URL.createObjectURL(blob);

                if (url && audioRef.current) {
                    audioRef.current.src = url;
                    audioRef.current.load();
                    audioRef.current.play();
                    dispatch(setPlay(true));
                }
            } else {
                const url = await download();

                if (url && audioRef.current) {
                    audioRef.current.src = url;
                    audioRef.current.load();
                    audioRef.current.play();
                    dispatch(setPlay(true));
                }
            }
        } catch (error) {
            console.error('Ошибка при работе с кешом:', error, songData.id);
        }
    };

    useEffect(() => {
        if (!songData?.id) return;
        loadTrack();
    }, [songData.id]);

    useEffect(() => {
        if (!audioRef.current || loading) return;

        audioRef.current.volume = volume;
        if (playing) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [playing, volume, loading]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (audioRef.current && desiredTime !== null) {
            audioRef.current.currentTime = desiredTime;
        }
    }, [desiredTime]);

    useEffect(() => {
        if (audioRef.current) {
            if (playing) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [playing]);

    useEffect(() => {
        if ('mediaSession' in navigator && songData) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songData.title || 'Неизвестный трек',
                artist: songData.artist || 'Неизвестный исполнитель',
                album: songData.album || '',
                // Добавьте сюда обложку из кеша
            });

            navigator.mediaSession.setActionHandler('play', () => {
                dispatch(setPlay(true));
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                dispatch(setPlay(false));
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                dispatch(prevSong())
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                dispatch(nextSong())
            });
        }
    }, [songData]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            dispatch(setCurrentTime(audioRef.current.currentTime));
        }
    };

    const handleLoadedMeta = () => {
        if (audioRef.current) {
            dispatch(setDuration(audioRef.current.duration));
        }
    };

    const handleEnded = () => {
        if (currentSongIndex < songsQueue.length - 1) {
            dispatch(nextSong());
        } else {
            dispatch(setPlay(false));
            dispatch(setCurrentTime(0));
        }
    };

    return (
        <audio
            ref={audioRef}
            loop={loop}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMeta}
            onEnded={handleEnded}
        />
    );
};

export default AudioPlayer;
