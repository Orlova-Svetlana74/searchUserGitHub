import axios from 'axios';
import React, { useState } from 'react';
import s from './main.module.css';

const UserSearch: React.FC = () => {
  const [login, setLogin] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [repositories, setRepositories] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    login: '',
    created_at: '',
    public_repos: null,
    followers: null,
  });

  interface User {
    login: string;
    id: number;
    avatar_url: string;
    public_repos: number;
    created_at: string;
    followers: number;
  }

  const fetchUsersRepAsc = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${login}&sort=repositories&order=asc`
      );
      setUsers(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUsersRepDesc = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${login}&sort=repositories&order=desc`
      );
      setUsers(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const handleSubmitDesc = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetchUsersRepDesc();
  };

  const handleSubmitAsc = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetchUsersRepAsc();
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);

    fetch(`https://api.github.com/users/${user.login}/repos`)
      .then((response) => response.json())
      .then((data) => setRepositories(data))
      .catch((error) => console.log(error));
  };
  const renderPopup = () => {
    if (selectedUser) {
      return (
        <div>
          <h2 className={s.popup}>Пользователь:    {selectedUser.login}</h2>
          <h2 className={s.popup}>Количество репозиториев:   {repositories.length}</h2>
        </div>
      );
    }
    return null;
  };
  return (
    <div>
      <h1 className={s.tytle_user}>Поиск пользователя GitHub</h1>
      <div className={s.search_user}>
        <form className={s.form_user} onSubmit={handleSubmitDesc}>
          <input
            className={s.input_user}
            placeholder="введите логин"
            type="text"
            value={login}
            onChange={handleChange}
          />
          <button className={s.button} type="submit">
            Search & Descending
          </button>
        </form>
        <form onSubmit={handleSubmitAsc}>
          <button className={s.button} type="submit">
            Search & Ascending
          </button>
        </form>
      </div>

      <div className={s.box_user}>
        {users.map((user) => (
          <div key={user.id}>
            <div className={s.info_user} onClick={() => handleUserClick(user)}>
              <div>
                <img
                  className={s.img_user}
                  src={user.avatar_url}
                  alt={user.login}
                />
              </div>
              <div className={s.login_user}>{user.login}</div>
              <div>{user.followers}</div>
            </div>
          </div>
        ))}
      </div>
      {renderPopup()}
    </div>
  );
};

export default UserSearch;
