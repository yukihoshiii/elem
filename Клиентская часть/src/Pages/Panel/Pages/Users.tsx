import { useEffect, useState } from 'react';
import { I_BACK, I_CLOSE, I_GOVERN, I_SEND } from '../../../System/UI/IconPack';
import { AnimatePresence, motion } from 'framer-motion';
import { useModal } from '../../../System/Context/Modal';
import { Avatar, TextInput } from '../../../UIKit';
import { useWebSocket } from '../../../System/Context/WebSocket';

const HandleUser = ({ user }) => {
    const { openModal } = useModal();
    const { wsClient } = useWebSocket();
    const { t } = useWebSocket();
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [password, setPassword] = useState('');

    const changePassword = () => {
        wsClient.send({
            type: 'social',
            action: 'dashboard/users/change_password',
            payload: {
                uid: user.id,
                password: password
            }
        }).then((res) => {
            if (res.status === 'success') {
                openModal({
                    'type': 'info',
                    'title': t('success'),
                    'text': 'Пароль изменен успешно',
                })
            } else {
                openModal({
                    'type': 'info',
                    'title': t('error'),
                    'text': res.message,
                })
            }
        })
        setChangePasswordOpen(false);
        setPassword('');
    }

    return (
        <div className="Dashboard-User UI-Block">
            <Avatar
                avatar={user.avatar}
                name={user.name}
            />
            <div className="BaseInfo">
                <div className="Name">{user.name}</div>
                <div className="Username">@{user.username}</div>
            </div>
            <div className="LiteInfo">
                <div className="Text">UID: {user.id}</div>
                <div className="Text">{user.email}</div>
            </div>
            <AnimatePresence>
                {
                    changePasswordOpen && (
                        <motion.div
                            className="ChangePassword"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.1 }}
                        >
                            <TextInput
                                placeholder="Новый пароль"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        changePassword();
                                    }
                                }}
                            />
                            <button className="Send" onClick={changePassword}>
                                <I_SEND />
                            </button>
                            <button className="Close" onClick={() => setChangePasswordOpen(false)}>
                                <I_CLOSE />
                            </button>
                        </motion.div>
                    )
                }
            </AnimatePresence>
            <div className="GovernButtons">
                <button onClick={() => { setChangePasswordOpen(true) }}>
                    <I_GOVERN />
                </button>
            </div>
        </div>
    )
}

const Users = () => {
    const { wsClient } = useWebSocket();
    const [searchValue, setSearchValue] = useState<string>('');
    const [users, setUsers] = useState<any>([]);
    const [usersCount, setUsersCount] = useState<number>(0);
    const [startIndex, setStartIndex] = useState<number>(0);

    const loadUsers = ({ startIndex, searchValue }) => {
        wsClient.send({
            type: 'social',
            action: 'dashboard/users/load',
            payload: {
                start_index: startIndex,
                search_value: searchValue
            }
        }).then((res) => {
            if (res.users) {
                setUsers(res.users);
                setUsersCount(res.users_count);
            }
        });
    }

    const search = () => {
        loadUsers({ startIndex: 0, searchValue: searchValue });
        setStartIndex(0);
    }

    const next = () => {
        if (startIndex < usersCount) {
            setStartIndex(startIndex + 50);
            loadUsers({ startIndex: startIndex + 50, searchValue: searchValue });
        }
    }

    const back = () => {
        if (startIndex !== 0) {
            setStartIndex(startIndex - 50);
            loadUsers({ startIndex: startIndex - 50, searchValue: searchValue });
        }
    }

    useEffect(() => {
        loadUsers({ startIndex: 0, searchValue: '' });
    }, [])

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }} className="UI-Block UI-B_FIRST">
                <div className="UI-Title">Пользователи</div>
                <div className="Dashboard-Search">
                    <TextInput
                        placeholder="Поиск"
                        value={searchValue}
                        onChange={(e) => { setSearchValue(e.target.value) }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                search();
                            }
                        }}
                    />
                    <button onClick={search}>
                        <I_SEND />
                    </button>
                </div>
            </div>
            <div className="Dashboard-Users">
                {
                    users.length > 0 && (
                        users.map((user) => (
                            <HandleUser key={user.id} user={user} />
                        ))
                    )
                }
            </div>
            <div className="Dashboard-BottomBar">
                <button onClick={back} className={`Back ${startIndex === 0 ? 'NonActiveButton' : ''}`}>
                    <I_BACK />
                    Назад
                </button>
                <div className="Pages">
                    <div style={{ marginRight: 3 }}>{startIndex + 50}</div>
                    из
                    <div style={{ marginLeft: 3 }}>{usersCount}</div>
                </div>
                <button onClick={next} className={`Next ${startIndex > usersCount ? 'NonActiveButton' : ''}`}>
                    <I_BACK />
                    Вперёд
                </button>
            </div>
        </>
    )
}

export default Users;