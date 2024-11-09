import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
// Убедитесь, что путь к store корректен
import './UserSidebar.css';
import serverStore from '../../../../store/serverStore';

const UserSidebar = observer(() => {
    // Загрузка пользователей, если список пуст
    useEffect(() => {}, []);
    console.log(serverStore);
    return (
        <aside className="user-sidebar">
            <h3>Пользователи</h3>
            <ul>
                {serverStore.users.map((user) => (
                    <li key={user.id} className="user-info">
                        <p>
                            <strong>{user.username}</strong>
                        </p>
                        <p>#{user.id}</p>
                    </li>
                ))}
            </ul>
        </aside>
    );
});

export default UserSidebar;
