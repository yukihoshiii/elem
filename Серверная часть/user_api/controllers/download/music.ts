import { fileTypeFromBuffer } from 'file-type';
import MusicManager from '../../../services/music/MusicManager.js';
import FileManager from '../../../services/system/FileManager.js';
import NodeID3 from 'node-id3';

const music = async ({ account, data }) => {
    if (!data.song_id) return;

    const musicManager = new MusicManager(account.ID);
    const result = await musicManager.loadSong(data.song_id);
    const song = result.song;

    if (!song || !song.file) return {
        status: 404,
        message: 'Песня не найдена'
    };
    const songFile = JSON.parse(song.file);

    const tempFile = await FileManager.getFromStorage(`music/files/${songFile.file}`)
    const { mime, ext } = await fileTypeFromBuffer(tempFile.buffer);

    if (mime === 'audio/mpeg' || mime === 'audio/x-m4a') {
        const metadata: any = {
            title: song.title,
            artist: song.artist
        };
    
        if (song.album) metadata.album = song.album;
        if (song.genre) metadata.genre = song.genre;
        if (song.composer) metadata.composer = song.composer;
    
        if (song.cover && song.cover.image) {
            const cover = await FileManager.getFromWebStorage(`/Music/Covers/${result.song.cover.image}`);
            const type = await fileTypeFromBuffer(cover);
            if (type.mime.startsWith('image/')) {
                metadata.image = {};
                metadata.image.mime = type.mime;
                metadata.image.imageBuffer = cover;
                metadata.image.type = {};
                metadata.image.type.id = 3;
                metadata.image.type.name = 'front cover';
            }
        }
    
        NodeID3.write(metadata, tempFile.buffer);
    }

    return {
        status: 200,
        file: {
            binary: tempFile.buffer,
            name: `${song.artist} - ${song.title}.${ext}`,
            mime: mime
        }
    }
}

export default music;