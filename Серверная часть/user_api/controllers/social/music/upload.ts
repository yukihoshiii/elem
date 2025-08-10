import { fileTypeFromBuffer } from 'file-type';
import AccountManager from '../../../../services/account/AccountManager.js';
import RouterHelper from '../../../../services/system/RouterHelper.js';
import { dbQueryE } from '../../../../system/global/DataBase.js';
import Config from '../../../../system/global/Config.js';
import { parseBuffer } from 'music-metadata';
import { getDate } from '../../../../system/global/Function.js';
import FileManager from '../../../../services/system/FileManager.js';
import ImageEngine from '../../../../services/system/ImageEngine.js';
import Validator from '../../../../services/system/Validator.js';

const upload = async ({ account, data }) => {
    const {
        title,
        artist,
        album,
        track_number,
        genre,
        release_year,
        composer,
        audio_file,
        cover_file
    } = data.payload;

    let cover = null;
    const accountManager = new AccountManager(account.ID);
    const isGold = await accountManager.getGoldStatus();
    const validator = new Validator();

    if (await checkTime(account.ID)) {
        return RouterHelper.sendError('Добавлять музыку можно раз в 30 секунд')
    }

    if (!audio_file || !(audio_file instanceof Buffer)) {
        return RouterHelper.sendError('Аудио-файл отсутствует');
    }

    const fileType = await fileTypeFromBuffer(audio_file);
    if (!fileType) {
        return RouterHelper.sendError('Не удалось определить формат аудио-файла');
    }
    const { mime } = fileType;

    const allowed = isGold
        ? ['audio/flac', 'audio/x-flac', 'audio/wav', 'audio/mpeg']
        : ['audio/mpeg'];

    const maxSize = isGold ? Config.LIMITS.GOLD.AUDIO_SIZE : Config.LIMITS.DEFAULT.AUDIO_SIZE;

    if (!allowed.includes(mime)) {
        return RouterHelper.sendError(isGold
            ? 'Ошибка формата аудио файла'
            : 'Ошибка формата аудио файла, вы можете загружать музыку только в формате MP3, но купив подписку Gold, вам будут доступны ещё форматы «flac» и «wav».'
        );
    }
    if (audio_file.length > maxSize) {
        return RouterHelper.sendError(`Максимальный размер аудио файла ${maxSize / (1024 * 1024)} МБ`);
    }

    validator.validateText({
        title: 'Название',
        maxLength: 250,
        value: title
    })

    validator.validateText({
        title: 'Исполнитель',
        maxLength: 250,
        value: artist
    });

    validator.validateText({
        title: 'Альбом',
        maxLength: 250,
        nullable: true,
        value: album
    });

    validator.validateNumber({
        title: 'Номер трека',
        value: track_number,
        min: 1,
        max: 9999,
        nullable: true
    });

    validator.validateText({
        title: 'Жанр',
        maxLength: 100,
        nullable: true,
        value: genre
    });

    validator.validateText({
        title: 'Год релиза',
        value: release_year,
        maxLength: 100,
        nullable: true
    });

    validator.validateText({
        title: 'Композитор',
        maxLength: 250,
        nullable: true,
        value: composer
    });

    if (cover_file) {
        await validator.validateImage(cover_file, Config.LIMITS.DEFAULT.AUDIO_COVER_SIZE);

        const ie = new ImageEngine();
        cover = await ie.create({
            file: cover_file,
            path: 'music/covers',
            simpleSize: 400
        })
    }

    const metadata = await parseBuffer(audio_file);
    const duration = metadata.format.duration;
    const bitrate = metadata.format.bitrate;
    const container = metadata.format.container;
    const codec = metadata.format.codec;

    if (!(duration && bitrate && container && codec)) {
        return RouterHelper.sendError('Файл повреждён.');
    }

    if (!(title && artist)) {
        return RouterHelper.sendError('Нужно ввести обязательные метаданные.');
    }

    const file = await FileManager.saveFile('music/files', audio_file);

    const fileJson = JSON.stringify({
        file: file,
        path: 'music/files',
    })

    const query = `
    INSERT INTO songs 
        (uid, title, artist, cover, file, album, genre, track_number, release_year, composer, lyrics, duration, bitrate, audio_format, date_added)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await dbQueryE(
        query,
        [
            account.ID,
            title,
            artist,
            JSON.stringify(cover),
            fileJson,
            album || null,
            genre || null,
            isNaN(Number(track_number)) || track_number === '' ? null : parseInt(track_number),
            isNaN(Number(release_year)) || release_year === '' ? null : parseInt(release_year),
            composer || null,
            null,
            duration,
            bitrate,
            container,
            getDate()
        ]
    );

    return RouterHelper.sendAnswer('Песня добавлена');
}

async function checkTime(userId) {
    const [rows] = await dbQueryE(
        `SELECT date_added FROM songs WHERE uid = ? ORDER BY date_added DESC LIMIT 1`,
        [userId]
    );
    if (!rows.length) return false;
    const last = new Date(rows[0].date_added).getTime();
    return (Date.now() - last) < 30_000;
}

export default upload;