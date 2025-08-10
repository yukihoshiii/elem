-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.2
-- Время создания: Июн 01 2025 г., 03:07
-- Версия сервера: 8.2.0
-- Версия PHP: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `element`
--

-- --------------------------------------------------------

--
-- Структура таблицы `accounts`
--

CREATE TABLE `accounts` (
  `ID` int NOT NULL,
  `Name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Username` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Avatar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Cover` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Subscribers` int NOT NULL DEFAULT '0',
  `Subscriptions` int NOT NULL DEFAULT '0',
  `Posts` int NOT NULL DEFAULT '0',
  `Links` int NOT NULL DEFAULT '0',
  `Notifications` int NOT NULL DEFAULT '0',
  `Eballs` decimal(10,3) NOT NULL DEFAULT '0.000',
  `Keyword` int NOT NULL DEFAULT '0',
  `ChatsMoved` int NOT NULL DEFAULT '0',
  `LastPost` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_online` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `messenger_size` int NOT NULL DEFAULT '0',
  `CreateDate` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `accounts_links`
--

CREATE TABLE `accounts_links` (
  `ID` int UNSIGNED NOT NULL,
  `UserID` int NOT NULL,
  `Title` varchar(50) NOT NULL,
  `Link` text NOT NULL,
  `Date` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `accounts_permissions`
--

CREATE TABLE `accounts_permissions` (
  `ID` int UNSIGNED NOT NULL,
  `UserID` int NOT NULL,
  `Admin` int NOT NULL DEFAULT '0',
  `Posts` int NOT NULL DEFAULT '1',
  `Comments` int NOT NULL DEFAULT '1',
  `NewChats` int NOT NULL DEFAULT '1',
  `MusicUpload` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `accounts_sessions`
--

CREATE TABLE `accounts_sessions` (
  `id` int NOT NULL,
  `uid` int NOT NULL,
  `s_key` varchar(100) NOT NULL,
  `device_type` int NOT NULL,
  `device` text NOT NULL,
  `create_date` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `blocked`
--

CREATE TABLE `blocked` (
  `id` int UNSIGNED NOT NULL,
  `uid` int NOT NULL,
  `author_id` int NOT NULL,
  `author_type` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `channels`
--

CREATE TABLE `channels` (
  `ID` int UNSIGNED NOT NULL,
  `Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Owner` int NOT NULL,
  `Avatar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Cover` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Subscribers` int NOT NULL DEFAULT '0',
  `Posts` int NOT NULL DEFAULT '0',
  `Banned` int NOT NULL DEFAULT '0',
  `CreateDate` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `comments`
--

CREATE TABLE `comments` (
  `id` int UNSIGNED NOT NULL,
  `uid` int NOT NULL,
  `post_id` int NOT NULL,
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'text',
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` json DEFAULT NULL,
  `date` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `gold_codes`
--

CREATE TABLE `gold_codes` (
  `id` int UNSIGNED NOT NULL,
  `code` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `activated` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `gold_subs`
--

CREATE TABLE `gold_subs` (
  `id` int UNSIGNED NOT NULL,
  `uid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `received` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `icons`
--

CREATE TABLE `icons` (
  `ID` int UNSIGNED NOT NULL,
  `UserID` int NOT NULL,
  `IconID` varchar(100) NOT NULL,
  `Date` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Структура таблицы `music_likes`
--

CREATE TABLE `music_likes` (
  `id` int UNSIGNED NOT NULL,
  `uid` int NOT NULL,
  `target_id` int NOT NULL,
  `type` int NOT NULL DEFAULT '0',
  `date` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `notifications`
--

CREATE TABLE `notifications` (
  `id` int UNSIGNED NOT NULL,
  `from` int DEFAULT NULL,
  `for` int NOT NULL,
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `viewed` int NOT NULL DEFAULT '0',
  `date` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `playlists`
--

CREATE TABLE `playlists` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text,
  `cover` json DEFAULT NULL,
  `owner` int NOT NULL,
  `privacy` int NOT NULL DEFAULT '0',
  `create_date` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `playlists_songs`
--

CREATE TABLE `playlists_songs` (
  `id` int UNSIGNED NOT NULL,
  `song_id` int NOT NULL,
  `playlist_id` int NOT NULL,
  `date_added` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `posts`
--

CREATE TABLE `posts` (
  `id` int UNSIGNED NOT NULL,
  `author_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `author_type` int NOT NULL,
  `content_type` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'text',
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` json DEFAULT NULL,
  `likes` int NOT NULL DEFAULT '0',
  `dislikes` int DEFAULT '0',
  `comments` int NOT NULL DEFAULT '0',
  `hidden` int DEFAULT '0',
  `date` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `post_dislikes`
--

CREATE TABLE `post_dislikes` (
  `ID` int UNSIGNED NOT NULL,
  `PostID` int NOT NULL,
  `UserID` int NOT NULL,
  `Date` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Структура таблицы `post_likes`
--

CREATE TABLE `post_likes` (
  `ID` int UNSIGNED NOT NULL,
  `PostID` int NOT NULL,
  `UserID` int NOT NULL,
  `Date` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Структура таблицы `songs`
--

CREATE TABLE `songs` (
  `id` int UNSIGNED NOT NULL,
  `uid` int NOT NULL,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `artist` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cover` json DEFAULT NULL,
  `file` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `album` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `genre` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `track_number` int DEFAULT NULL,
  `release_year` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `composer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `lyrics` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `duration` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `bitrate` int DEFAULT NULL,
  `audio_format` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `date_added` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `subscriptions`
--

CREATE TABLE `subscriptions` (
  `ID` int UNSIGNED NOT NULL,
  `User` int NOT NULL,
  `Target` int NOT NULL,
  `TargetType` int NOT NULL,
  `Date` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Структура таблицы `updates`
--

CREATE TABLE `updates` (
  `id` int UNSIGNED NOT NULL,
  `type` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `version` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `updates`
--

INSERT INTO `updates` (`id`, `type`, `version`, `content`) VALUES
(1, 'release', '0.1', '{\"changes\": [\"Добавлен месенджер\", \"Улучшение безопасности\", \"Изменён шрифт\", \"Не большие изменения в интерфейсе\", \"Оптимизация и удаление лишних элементов\"]}'),
(2, 'release', '0.2', '{\"changes\": [\"Малозаметные изменения\", \"Добавлена страница \\\"Настройки\\\"\", \"Добавлен выбор устройства для адаптации контента\", \"Адаптация чата под телефоны\", \"Улучшение защиты\"]}'),
(3, 'release', '0.3', '{\"changes\": [\"Теперь при выходе с сайта сессия остаётся\", \"Переработан вход в аккаунт и регистрация\", \"Теперь для регистрации нужно использовать настоящую почту\", \"Добавлена кнопка \\\"Показать больше\\\"\", \"Исправление багов\", \"Улучшение чата\", \"Улучшение интерфейса\"]}'),
(4, 'release', '0.4', '{\"changes\": [\"Улучшение защиты\", \"Посты теперь нужно публиковать раз в три минуты\"]}'),
(5, 'release', '0.4.1', '{\"changes\": [\"Лайки и дизлайки работают более стабильно\", \"Улучшение защиты\", \"Исправление багов\"]}'),
(6, 'release', '0.5', '{\"changes\": [\"Добавлены комментарии\", \"Улучшение интерфейса\", \"Исправление багов\", \"Теперь в уникальном нике нельзя указывать символы, к примеру \\\"/, $, &\\\"\"]}'),
(7, 'release', '0.6', '{\"changes\": [\"Теперь к постам можно прикрепить изображение\", \"Добавлена страница \\\"Информация\\\"\", \"Переписана система вывода постов\", \"Улучшение защиты\", \"Улучшение интерфейса\", \"Улучшение модерации\", \"Исправление багов\"]}'),
(8, 'release', '0.7', '{\"changes\": [\"Новый интерфейс\", \"Добавлена тёмная тема\", \"При написании поста теперь строка расширяется в зависимости от количества текста\", \"Письма подтверждения теперь нормальные\", \"Исправление багов\", \"Оптимизация\"]}'),
(9, 'release', '0.8', '{\"changes\": [\"Рабочий поиск\", \"Добавлена информация о профиле\", \"Теперь если у вас нет аватара, будет показываться первая буква вашего имени\", \"Оптимизация\"]}'),
(10, 'release', '0.9', '{\"changes\": [\"Добавлена подписка Gold\", \"Добавлена мобильная навигация\", \"Обновлён список разрешенных почт для создания аккаунта\", \"Ускорены анимации\", \"Улучшение интерфейса\", \"Исправление багов\"]}'),
(11, 'release', '1.0', '[{\"title\": \"Для Gold-пользователей\", \"changes\": [\"Теперь можно добавить описание к профилю\", \"Теперь можно отключить золотую тему\"]}, {\"title\": \"Для всех\", \"changes\": [\"Улучшение настроек, а именно - теперь можно изменить имя или же удалить аватарку\", \"Сайт стал работать более плавно, так же была изменена структура сайта\", \"Система тем была переписана\", \"Лента постов теперь работает адекватно\", \"Теперь мы не собираем данные об устройстве\", \"Улучшение интерфейса\", \"Исправление багов\"]}]'),
(12, 'beta', '1.0.1', '{\"changes\": [\"В URL больше не используется кирилица\", \"Изменены шрифты\", \"Улучшение интерфейса\", \"Улучшение адаптации интерфейса\", \"Изменена анимация \\\"Поделиться\\\"\", \"Изменена анимация при наведении на почту в настройках\"]}'),
(13, 'beta', '1.0.2', '{\"changes\": [\"Теперь можно добавить обложку в профиль\", \"Вы теперь можете посмотреть профиль без аккаунта\", \"Улучшена оптимизация страницы профиля\", \"Исправление багов прошлой версии\"]}'),
(14, 'beta', '1.0.3', '{\"changes\": [\"Улучшена сортировка чатов в мессенджере\", \"Оптимизация мессенджера\"]}'),
(15, 'beta', '1.0.4', '{\"changes\": [\"Теперь можно удалить спам-чат\", \"Теперь можно отправить сообщение на Enter\", \"Улучшена стабильность мессенджера\", \"Исправление багов\"]}'),
(16, 'release', '1.1', '{\"changes\": [\"Теперь можно добавить обложку к профилю\", \"Обновлена страница авторизации\", \"Описание теперь может поставить даже пользователь без Gold подписки\", \"В URL больше не используется кирилица\", \"Обновление мессенджера\", \"Исправление багов\", \"Оптимизация\", \"Улучшение интерфейса\"]}'),
(17, 'beta', '1.1.1', '{\"changes\": [\"Теперь вы можете удалить свой пост\", \"Улучшение интерфейса\"]}'),
(18, 'beta', '1.1.2', '{\"changes\": [\"Кнопка поделиться теперь работает везде\", \"Теперь можно полноценно посмотреть изображение или же скачать его\", \"Теперь можно использовать эмодзи и HTML символы\", \"Теперь список Gold пользователей есть на главной странице\", \"Исправление багов\", \"Улучшение интерфейса\"]}'),
(19, 'beta', '1.1.3', '[{\"title\": \"Для Gold пользователей\", \"changes\": [\"Вы можете сохранить любой пост в формате EPACK\"]}, {\"title\": \"Для всех\", \"changes\": [\"Можно посмотреть пост в формате EPACK в новой вкладке\", \"Добавлен предпросмотр функций на странице подписки\", \"Улучшен, и оптимизирован интерфейс\"]}]'),
(20, 'beta', '1.1.4', '{\"changes\": [\"Итак, самое важное, то чего нам всем не хватало... ТЕПЕРЬ МОЖНО ПЕРЕЙТИ НА ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ПРИ НАЖАТИИ НА НИК В ПОСТЕ\", \"Добавлена анимация загрузки\", \"Исправлена уязвимость в EPACK\", \"Исправлены многие серьёзные и не очень баги\", \"Улучшение интерфейса\"]}'),
(21, 'beta', '1.1.5', '{\"changes\": [\"Теперь можно подписываться на пользователей, и видеть такой контент, который вы хотите\", \"Теперь можно открыть фото на весь экран\", \"Исправлены некоторые баги\", \"Добавлена предзагрузка постов\", \"Улучшение интерфейса\"]}'),
(22, 'beta', '1.1.6', '{\"changes\": [\"Теперь можно публиковать деликатный контент, а так же очистить метаданные при отправке файла\", \"Чат адаптирован под телефоны\", \"Теперь при выборе темы с демонстрациями преимуществ подписки Gold, адаптируется видео\", \"Изменены правила, подробнее на beta.elm.lol/info/rules\", \"Улучшение интерфейса\", \"Исправление багов\"]}'),
(23, 'release', '1.2', '[{\"title\": \"Для Gold пользователей\", \"changes\": [\"Вы можете сохранить любой пост в формате EPACK\"]}, {\"title\": \"Для всех\", \"changes\": [\"Добавлен предпросмотр функций на странице подписки\", \"Добавлена анимация загрузки некоторых элементов\", \"Теперь можно подписываться на пользователей, и видеть такой контент, который вы хотите\", \"Теперь можно публиковать деликатный контент, а так же очистить метаданные при отправке файла\", \"Теперь список Gold пользователей есть на главной странице\", \"Теперь можно использовать эмодзи и HTML символы\", \"Теперь можно полноценно посмотреть изображение или же скачать его\", \"Теперь вы можете удалить свой пост\", \"Теперь при выборе темы с демонстрациями преимуществ подписки Gold, адаптируется видео\", \"Чат адаптирован под телефоны\", \"Улучшен, и оптимизирован интерфейс\", \"Исправление багов\", \"Изменены правила, подробнее на elm.lol/info/rules\"]}]'),
(24, 'release', '1.3', '{\"changes\": [\"Новый интерфейс\", \"Теперь можно сменить почту или пароль\", \"Исправление багов\", \"Улучшение оптимизации\"]}'),
(25, 'release', '1.4', '{\"changes\": [\"Теперь можно публиковать файлы\", \"Добавлены две вкладки в настройках, а именно «Подписка Gold» и «Авторы»\", \"Исправлена проблема с загрузкой EPACK и удалением постов\", \"Исправление багов\", \"Улучшение интерфейса\"]}'),
(26, 'release', '1.5', '[{\"title\": \"Для Gold пользователей\", \"changes\": [\"Теперь можно добавить красивые ссылки в профиль\", \"Увеличенные лимиты\"]}, {\"title\": \"Для всех\", \"changes\": [\"Посты теперь можно делать раз в минуту\", \"EPACK теперь доступен всем\", \"Ссылки в постах, описании профиля теперь можно нажать\", \"Увеличенные лимиты\", \"Добавлены рекомендации\", \"Улучшение интерфейса\", \"Исправление багов\"]}]'),
(27, 'release', '1.6', '{\"changes\": [\"Добавлены уведомления\", \"Теперь можно восстановить пароль от аккаунта\", \"Теперь можно оставить комментарий до 700 символов\", \"Рендер отдельного поста теперь происходит на стороне клиента\", \"Теперь в комментариях отображаются значки пользователей\", \"Исправлена уязвимость в EPACK\", \"Добавлена страница API (/info/API)\", \"Улучшение интерфейса\", \"Исправлены различные ошибки\"]}'),
(28, 'release', '1.7', '{\"changes\": [\"Добавлена музыка\", \"Добавлена система ограничений\", \"Обновлена страница API (info/API)\", \"Улучшение модерации\", \"Улучшение интерфейса\", \"Исправление ошибок\"]}'),
(29, 'release', '1.8', '{\"changes\": [\"Улучшен поиск, а так же теперь можно искать музыку.\", \"Теперь можно посмотреть кто именно на вас подписан, а так же посмотреть свои подписки.\", \"Теперь можно поделиться песней.\", \"Улучшено отображение обложек в музыке.\", \"Теперь можно добавить песню в пост.\", \"Рекомендации теперь работают более корректно.\", \"Улучшение мессенджера.\", \"Улучшение интерфейса.\", \"Исправление ошибок.\", \"Теперь для смены почты нужно подтвердить новую почту.\"]}'),
(30, 'release', '1.8.88 (Первоапрельская шутка)', '{\"changes\": [\"Добавлена валюта «Е-Баллы».\", \"Добавлены новые баги, чтобы было что исправлять.\"]}'),
(31, 'release', '1.9', '[{\"title\": \"Для Gold-пользователей\", \"changes\": [\"Теперь можно оставить посты/комментарии до 3400 символов\", \"Лимит файлов увеличен до 50 МБ\", \"Максимальный размер аудиофайла для музыки увеличен до 30 МБ\", \"Теперь вы можете загружать музыку в Lossless-качестве\"]}, {\"title\": \"Для всех\", \"changes\": [\"Задержка публикации постов теперь 15 секунд для всех\", \"Теперь можно оставить посты/комментарии до 1400 символов\", \"Лимит файлов увеличен до 20 МБ\", \"Теперь можно отправить до 150 изображений в одном посте\", \"Улучшение интерфейса\", \"Исправление ошибок\"]}]'),
(32, 'release', '1.9.1', '{\"changes\": [\"Теперь можно зациклить трек, или же воспроизводить треки в случайном порядке\", \"Лайки и дизлайки теперь работают быстро\", \"Теперь можно менять скорость анимаций\", \"Теперь можно менять посты на главной странице по умолчанию\", \"Исправление ошибок\", \"Улучшен интерфейс, а так же взаимодействие с ним\"]}'),
(33, 'beta', '1.9.2', '[{\"title\": \"Улучшение EPACK\'a\", \"changes\": [\"Теперь в EPACK сохраняются комментарии к посту, а так же их можно просмотреть\", \"Теперь можно посмотреть изображение и сохранить его в виде файла\"]}, {\"title\": \"Прочее\", \"changes\": [\"Мессенджер теперь использует ВебСокеты с end to end шифрованием\", \"Улучшен интерфейс, а так же взаимодействие с ним\"]}]'),
(34, 'release', '1.9.3', '[{\"title\": \"Основные изменения\", \"changes\": [\"Теперь с подпиской Gold вы можете сменить почту на любую, даже со своим доменом\", \"Улучшена оптимизация\"]}, {\"title\": \"Мессенджер\", \"changes\": [\"Теперь вы можете перенести свои чаты из старой системы\", \"Новый мессенджер оптимизирован под телефоны\", \"Окончательно удалён старый мессенджер\"]}]'),
(35, 'release', '1.9.4', '[{\"title\": \"Основные изменения\", \"changes\": [\"Обновлена анимация для удаления постов\", \"Оптимизирована загрузка изображений\", \"Теперь уведомления из мессенджера отображаются на главной\", \"Обновлена страница с API\", \"Исправление ошибок\"]}, {\"title\": \"Комментарии\", \"changes\": [\"В комментарии теперь можно добавлять изображения/файлы\", \"Переработан интерфейс комментариев\", \"Теперь можно отвечать на комментарии\"]}, {\"title\": \"Настройки\", \"changes\": [\"Обновлена вкладка «Подписка Gold»\"]}]'),
(36, 'release', '2.0', '{\"changes\": [\"Теперь Элемент использует React\", \"Теперь можно оставлять ссылки на пользователей внутри самого Элемента, к примеру @root\", \"Посты теперь грузятся без кнопки «Показать больше»\", \"Переработан просмотр изображений\", \"Добавлена поддержка видео в постах\", \"Улучшен интерфейс, анимации\"]}'),
(37, 'release', '2.1', '[{\"changes\": [\"Теперь можно создать свой канал\", \"Теперь можно сменить уникальное имя\", \"Теперь можно сменить язык интерфейса\", \"Добавлены иконки к каждому разделу в настройках\", \"Исправление некоторых ошибок\"]}, {\"title\": \"Удалены некоторые функции\", \"changes\": [\"Подключение приложений\", \"Смена скорости анимаций\"]}, {\"title\": \"Обновлён мессенджер\", \"changes\": [\"Теперь можно удалить все свои чаты\", \"Теперь можно отправлять фото/файлы\"]}]'),
(38, 'release', '2.2', '{\"changes\": [\"Ключ сессии стал более безопасным\", \"Улучшена безопасность паролей\", \"Добавлен раздел «Сессии» в настройках\", \"Обновлено API авторизации\", \"Исправление ошибок\"]}'),
(39, 'release', '2.3', '[{\"title\": \"Общие изменения\", \"changes\": [\"Соединение с ВебСокетом теперь стабильнее и потребляет меньше трафика\", \"Синхронизация с аккаунтом теперь происходит через ВебСокеты\", \"Теперь в профиле отображается статус, если пользователь в сети\", \"«Е-Баллы» возвращаются\", \"Ссылки в профиле теперь доступны всем\", \"Добавлен «Динамический остров»\", \"Добавлена возможность менять аккаунт\", \"Добавлен список людей, которые в данный момент находятся в сети\", \"Улучшена оптимизация\", \"Исправлены ошибки\"]}, {\"title\": \"Мессенджер\", \"changes\": [\"Улучшена структура чата, он теперь реже ломается\", \"Улучшена передача файлов\"]}]'),
(40, 'release', '2.4', '[{\"title\": \"Общие изменения\", \"changes\": [\"Соединение с сокетом теперь более стабильно\", \"Стену наконец-то вернули\", \"Обновлена страница «История обновлений»\", \"Обновлены языки\", \"Немного улучшен интерфейс\", \"Вторичные изменения\", \"Исправлены ошибки\"]}, {\"title\": \"Музыка\", \"changes\": [\"Логика переписана на Node.js\", \"Добавлен мини-плеер в верхнюю панель\", \"Теперь можно слушать музыку в фоне\", \"Теперь можно скачивать музыку\"]}, {\"title\": \"Поиск\", \"changes\": [\"Логика переписана на Node.js\", \"Теперь можно искать: пользователей, каналы, посты, музыку\", \"Улучшена анимация, и в целом интерфейс поиска\"]}, {\"title\": \"Подписка Gold\", \"changes\": [\"Теперь вы можете купить подписку за е-баллы!\"]}]'),
(41, 'release', '2.5', '[{\"title\": \"Общие изменения\", \"changes\": [\"Добавлены «Приложения», но пока что в ограниченном доступе.\", \"Теперь можно заблокировать пользователя или канал.\", \"Оптимизирован протокол передачи данных.\", \"Добавлена палитра эмодзи.\", \"Аватарки/обложки теперь загружаются через ВебСокет.\", \"Обновлены страницы информации.\", \"Исправлены темы.\", \"Улучшение интерфейса.\", \"Улучшен видеоплеер.\", \"Вторичные изменения.\", \"Исправлены ошибки.\"]}, {\"title\": \"Мессенджер\", \"changes\": [\"Оптимизирована отправка и загрузка файлов, опять.\", \"Добавлена сортировка сообщений в чатах по датам.\", \"Добавлены обои в чате.\", \"Добавлены группы.\", \"Вторичные изменения.\"]}, {\"title\": \"Просмотр изображений\", \"changes\": [\"Полностью переписан интерфейс с упором на удобство.\", \"Кнопка «Скачать» теперь работает исправно.\", \"Свернуть изображение теперь можно жестом.\"]}]'),
(42, 'release', '2.6', '[{\"title\": \"Общие изменения\", \"changes\": [\"Новое контекстное меню по всему сайту, его можно вызвать правой кнопкой мыши на некоторых элементах, по типу поста.\", \"Новый слайдер в плеерах.\", \"Теперь можно ставить лайки двойным нажатием на пост.\", \"Обновлён раздел «Авторы» в настройках.\", \"Добавлен раздел «Управление хранилищем» в настройках, там можно очистить кэш медиа.\", \"Теперь при создании поста, или написании сообщения можно перетащить файл в инпут.\", \"Улучшен просмотр изображений.\", \"Новая панель навигации на мобильных устройствах, а так же разгружен интерфейс.\", \"Комментарии/посты теперь используют ВебСокеты, а так же теперь можно добавить до 150 файлов/изображений в комментарий/пост.\", \"Теперь посты открываются в отдельном окне на ПК, а на мобильной версии теперь не нужно при открытии поста листать назад, чтобы вернуться в то место откуда перешли на пост.\", \"Добавлен зал славы, в котором можно посмотреть лучших пользователей по количеству Е-Баллов.\", \"Остальная часть Элемента теперь использует ВебСокеты.\", \"Добавлено форматирование текста.\", \"Улучшены анимации.\", \"Исправлены ошибки.\", \"Незначительные улучшения.\"]}, {\"title\": \"Музыка\", \"changes\": [\"Обложки, аудио-файлы теперь загружаются через ВебСокеты, и остаются в кеше для ускоренной загрузки.\", \"Теперь можно создавать плейлисты.\", \"Избранное теперь полноценный плейлист.\", \"Улучшена очередь воспроизведения, исправлены ошибки.\"]}, {\"title\": \"Мессенджер\", \"changes\": [\"Палитра эмодзи теперь доступна в мессенджере.\", \"Добавлена боковая панель с эмодзи.\", \"Теперь можно удалить выбранный файл.\"]}]');

-- --------------------------------------------------------

--
-- Структура таблицы `verify_email`
--

CREATE TABLE `verify_email` (
  `ID` int UNSIGNED NOT NULL,
  `Username` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Email` varchar(70) NOT NULL,
  `Password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Code` varchar(70) NOT NULL,
  `Attempt` int NOT NULL DEFAULT '0',
  `IP` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `wall`
--

CREATE TABLE `wall` (
  `id` int UNSIGNED NOT NULL,
  `author_type` int NOT NULL,
  `author_id` int NOT NULL,
  `pid` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `accounts`
--
ALTER TABLE `accounts`
  ADD UNIQUE KEY `ID` (`ID`);

--
-- Индексы таблицы `accounts_links`
--
ALTER TABLE `accounts_links`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `accounts_permissions`
--
ALTER TABLE `accounts_permissions`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `accounts_sessions`
--
ALTER TABLE `accounts_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `blocked`
--
ALTER TABLE `blocked`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Индексы таблицы `gold_codes`
--
ALTER TABLE `gold_codes`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `gold_subs`
--
ALTER TABLE `gold_subs`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `icons`
--
ALTER TABLE `icons`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `music_likes`
--
ALTER TABLE `music_likes`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Индексы таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Индексы таблицы `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `playlists_songs`
--
ALTER TABLE `playlists_songs`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Индексы таблицы `post_dislikes`
--
ALTER TABLE `post_dislikes`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Индексы таблицы `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `updates`
--
ALTER TABLE `updates`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `verify_email`
--
ALTER TABLE `verify_email`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `wall`
--
ALTER TABLE `wall`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `accounts`
--
ALTER TABLE `accounts`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `accounts_links`
--
ALTER TABLE `accounts_links`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `accounts_permissions`
--
ALTER TABLE `accounts_permissions`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `accounts_sessions`
--
ALTER TABLE `accounts_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `blocked`
--
ALTER TABLE `blocked`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `channels`
--
ALTER TABLE `channels`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `gold_codes`
--
ALTER TABLE `gold_codes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `gold_subs`
--
ALTER TABLE `gold_subs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `icons`
--
ALTER TABLE `icons`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `music_likes`
--
ALTER TABLE `music_likes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `playlists_songs`
--
ALTER TABLE `playlists_songs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `post_dislikes`
--
ALTER TABLE `post_dislikes`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `updates`
--
ALTER TABLE `updates`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT для таблицы `verify_email`
--
ALTER TABLE `verify_email`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `wall`
--
ALTER TABLE `wall`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
