import { useState } from 'react';
import { I_MUSIC } from '../../../System/UI/IconPack';
import { useModal } from '../../../System/Context/Modal';
import { useTranslation } from 'react-i18next';
import { FormButton, TextInput } from '../../../UIKit';
import { useWebSocket } from '../../../System/Context/WebSocket';
import { parseBlob } from 'music-metadata';

const AddSong = () => {
    const { t } = useTranslation();
    const { openModal } = useModal();
    const { wsClient } = useWebSocket();
    const [title, setTitle] = useState<string>('');
    const [artist, setArtist] = useState<string>('');
    const [album, setAlbum] = useState<string>('');
    const [trackNumber, setTrackNumber] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [releaseYear, setReleaseYear] = useState<string>('');
    const [composer, setComposer] = useState<string>('');
    const [coverFile, setCoverFile] = useState<any>(null);
    const [audioFile, setAudioFile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCoverFile(file);
    };

    const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAudioFile(file);
        try {
            const metadata = await parseBlob(file);
            setTitle(metadata.common.title ?? '');
            setArtist(metadata.common.artist ?? '');
            setAlbum(metadata.common.album ?? '');
            setReleaseYear(metadata.common.year?.toString() ?? '');
            setTrackNumber(metadata.common.track?.no?.toString() ?? '');
            setGenre(metadata.common.genre?.[0] ?? '');
            setComposer(metadata.common.albumartist ?? '');
    
            if (metadata.common.picture?.length) {
                const pic = metadata.common.picture[0];
                const blobData = new Blob([pic.data], { type: pic.format });
                const cover = new File([blobData], `cover.${pic.format.split('/')[1]}`, { type: pic.format });
                setCoverFile(cover);
            }
        } catch (error) {
            console.error('Metadata parsing error:', error);
        }
    };

    const send = async () => {
        setIsLoading(true);

        let fileArrayBuffer;
        let coverArrayBuffer;

        if (audioFile) {
            fileArrayBuffer = await audioFile.arrayBuffer();
        }
        if (coverFile) {
            coverArrayBuffer = await coverFile.arrayBuffer();
        }

        const payload = {
            title: title,
            artist: artist,
            album: album,
            track_number: trackNumber,
            genre: genre,
            release_year: releaseYear,
            composer: composer,
            audio_file: new Uint8Array(fileArrayBuffer),
            cover_file: new Uint8Array(coverArrayBuffer)
        }
        
        wsClient.send({
            type: 'social',
            action: 'music/upload',
            payload: payload
        }).then((res: any) => {
            setIsLoading(false);
            if (res.status=== 'success') {
                setTitle('');
                setArtist('');
                setAlbum('');
                setTrackNumber('');
                setGenre('');
                setReleaseYear('');
                setComposer('');
                setCoverFile(null);
                setAudioFile(null);
                openModal({
                    type: 'info',
                    title: t('success'),
                    text: 'Песня добавлена'
                })
            } else if (res.status === 'error') {
                openModal({
                    type: 'info',
                    title: t('error'),
                    text: res.message
                })
            }
        })
    }

    return (
        <>
            <div className="BaseInfo">
                <input onChange={handleCoverChange} id="MI-COVER_FILE" type="file" />
                <label className="Cover" htmlFor="MI-COVER_FILE">
                    <I_MUSIC />
                    <div className="Text">
                        {
                            coverFile && coverFile.name ? (
                                coverFile.name
                            ) : (
                                t('music_form_cover')
                            )
                        }
                    </div>
                </label>
                <div className="Inputs">
                    <div className="Inputs-Title">{t('music_form_info')}</div>
                    <TextInput
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                        type="text"
                        placeholder={t('music_form_title')}
                    />
                    <TextInput
                        value={artist}
                        onChange={(e) => { setArtist(e.target.value) }}
                        type="text"
                        placeholder={t('music_form_artist')}
                    />
                    <TextInput
                        value={album}
                        onChange={(e) => { setAlbum(e.target.value) }}
                        type="text"
                        placeholder={t('music_form_album')}
                    />
                </div>
            </div>
            <div className="InfoAndFile">
                <input onChange={handleAudioChange} id="MI-AUDIO_FILE" type="file" />
                <label htmlFor="MI-AUDIO_FILE">
                    <div className="Text">
                        {
                            audioFile && audioFile.name ? (
                                audioFile.name
                            ) : (
                                t('select_file')
                            )
                        }
                    </div>
                </label>
                <div className="Info">{t('music_form_metadata_info')}</div>
            </div>
            <div className="AllInfo">
                <div className="Inputs-Title">{t('music_form_secondary_info')}</div>
                <div className="Columns">
                    <div className="Column">
                        <TextInput
                            value={trackNumber}
                            onChange={(e) => { setTrackNumber(e.target.value) }}
                            type="text"
                            placeholder={t('music_form_track_number')}
                        />
                        <TextInput
                            value={genre}
                            onChange={(e) => { setGenre(e.target.value) }}
                            type="text"
                            placeholder={t('music_form_genre')}
                        />
                        <TextInput
                            value={releaseYear}
                            onChange={(e) => { setReleaseYear(e.target.value) }}
                            type="text"
                            placeholder={t('music_form_release_year')}
                        />
                    </div>
                    <div className="Column">
                        <TextInput
                            value={composer}
                            onChange={(e) => { setComposer(e.target.value) }}
                            type="text"
                            placeholder={t('music_form_composer')}
                        />
                    </div>
                </div>
            </div>
            <FormButton
                title={t('music_form_send')}
                onClick={send}
                isLoading={isLoading}
            />
        </>
    )
}

export default AddSong;