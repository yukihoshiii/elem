const Config = {
    ELEMENT_DATABASE: {
        HOST: 'MySQL-8.2',
        NAME: 'sn',
        USER: 'root',
        PASSWORD: ''
    },
    MESSENGER_DATABASE: {
        HOST: 'MySQL-8.2',
        NAME: 'sn_messenger',
        USER: 'root',
        PASSWORD: ''
    },
    APPS_DATABASE: {
        HOST: 'MySQL-8.2',
        NAME: 'sn_apps',
        USER: 'root',
        PASSWORD: ''
    },
    PORT: 8080,
    USE_HTTPS: false,
    SSL: {
        KEY: '',
        CERT: '',
        CA: ''
    },
    WEB_STORAGE: 'C:\\OSPanel\\home\\Element\\Content',
    LIMITS: {
        DEFAULT: {
            MAX_AVATAR_SIZE: 4 * 1024 * 1024,
            MAX_COVER_SIZE: 4 * 1024 * 1024,
            AUDIO_SIZE: 10 * 1024 * 1024,
            AUDIO_COVER_SIZE: 4 * 1024 * 1024
        },
        GOLD: {
            MAX_AVATAR_SIZE: 8 * 1024 * 1024,
            MAX_COVER_SIZE: 8 * 1024 * 1024,
            AUDIO_SIZE: 20 * 1024 * 1024
        },
        MAX_USER_SPACE: 200 * 1024 * 1024,
        MAX_FILE_SIZE: 5 * 1024 * 1024,
        MAX_APP_ICON_SIZE: 2 * 1024 * 1024,
        MAX_BLOCKED_USERS: 100,
        MAX_GROUPS: 100,
        MAX_PLAYLISTS: 100,
        MAX_CHANNELS: 20
    },
    REGISTRATION: true,
    CAPTCHA: true,
    CAPTCHA_URL: 'https://hcaptcha.com/siteverify',
    CAPTCHA_KEY: 'ES_8227cca58dc8405e80c8623dacc584ab',
    CHUNK_SIZE: 10 * 1024
}

export default Config;