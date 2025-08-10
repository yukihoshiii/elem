import AppError from '../../services/system/AppError.js';
import image from '../controllers/download/image.js';
import music from '../controllers/download/music.js';

const routes = {
    music: { h: music, useAccount: true },
    image: { h: image, useAccount: false }
};

const findRoute = (routesObj, segments) => {
    let current = routesObj;
    for (const segment of segments) {
        if (!current || typeof current !== 'object' || !current.hasOwnProperty(segment)) {
            return null;
        }
        current = current[segment];
    }

    if (current && typeof current === 'object' && typeof current.h === 'function') {
        return current;
    }
    return null;
};

const download = async (ws, action, data) => {
    try {
        const segments = action.split('/');
        const route = findRoute(routes, segments);

        if (!route) {
            return { status: 'error', message: 'Такого действия нет' };
        }

        if (route.useAccount && !ws.account && !ws.account?.ID) {
            return { status: 'error', message: 'Вы не вошли в аккаунт' };
        }

        const result = await route.h({ account: ws.account, data });

        return { action, ...result };
    } catch (error) {
        console.log(error);

        if (error instanceof AppError) {
            return { status: 'error', message: error.message };
        }
        return {
            status: 'error',
            message: 'Внутренняя ошибка сервера'
        };
    }
};

export default download;