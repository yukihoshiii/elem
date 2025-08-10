import mysql from 'mysql';
import Config from './Config.js';

// Подключение к базе данных
const pool_e = mysql.createPool({
    host: Config.ELEMENT_DATABASE.HOST,
    database: Config.ELEMENT_DATABASE.NAME,
    user: Config.ELEMENT_DATABASE.USER,
    password: Config.ELEMENT_DATABASE.PASSWORD,
    charset: 'utf8mb4'
})
const pool_m = mysql.createPool({
    host: Config.MESSENGER_DATABASE.HOST,
    database: Config.MESSENGER_DATABASE.NAME,
    user: Config.MESSENGER_DATABASE.USER,
    password: Config.MESSENGER_DATABASE.PASSWORD,
    charset: 'utf8mb4'
})
const pool_a = mysql.createPool({
    host: Config.APPS_DATABASE.HOST,
    database: Config.APPS_DATABASE.NAME,
    user: Config.APPS_DATABASE.USER,
    password: Config.APPS_DATABASE.PASSWORD,
    charset: 'utf8mb4'
})

// Запрос к базе данных
export const dbQueryE = (sql, args) => {
    try {
        return new Promise((resolve, reject) => {
            pool_e.query(sql, args, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        })
    } catch (error) {
        console.log('Ошибка при работе с БД (Э): ' + error);
    }
}
export const dbQueryM = (sql, args) => {
    try {
        return new Promise((resolve, reject) => {
            pool_m.query(sql, args, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        })
    } catch (error) {
        console.log('Ошибка при работе с БД (M): ' + error);
    }
}
export const dbQueryA = (sql, args) => {
    try {
        return new Promise((resolve, reject) => {
            pool_a.query(sql, args, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        })
    } catch (error) {
        console.log('Ошибка при работе с БД (П): ' + error);
    }
}