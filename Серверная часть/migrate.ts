import { parseBuffer } from 'music-metadata';
import FileManager from './services/system/FileManager.js';
import ImageEngine from './services/system/ImageEngine.js';
import { dbQueryE } from './system/global/DataBase.js';

const ie = new ImageEngine();

const run = async () => {
    const songs = await dbQueryE('SELECT * FROM `songs`');

    for (const song of songs) {
        const oldSFile = await FileManager.getFromWebStorage(`/Music/Files/${song.file}`);

        if (oldSFile) {
            const newFile = await FileManager.saveFile('music/files', oldSFile);

            if (newFile) {
                const metadata = await parseBuffer(oldSFile);
                const newFileJson = JSON.stringify({
                    file: newFile,
                    path: 'music/files',
                })
                const duration =  metadata.format.duration;
                await dbQueryE('UPDATE songs SET duration = ? WHERE id = ?', [duration, song.id]);
                await dbQueryE('UPDATE `songs` SET file = ? WHERE id = ?', [newFileJson, song.id]);
            }
        }

        if (song.cover && oldSFile) {
            const cover = JSON.parse(song.cover);
            const oldFile = await FileManager.getFromWebStorage(`/Music/Covers/${cover.image}`);

            if (oldFile) {
                const file = await ie.create({
                    file: oldFile,
                    path: 'music/covers',
                    simpleSize: 400
                })
                await dbQueryE('UPDATE `songs` SET cover = ? WHERE id = ?', [JSON.stringify(file), song.id]);
                console.log('Обложка найдена и обработана');
            } else {
                await dbQueryE('UPDATE `songs` SET cover = null WHERE id = ?', [song.id]);
            }

            console.log('Обновлена песня ', song.id);
        }
    }
}

run();