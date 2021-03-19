import React, {useState, useEffect, useContext} from 'react';
import MetaTags from 'react-meta-tags';
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';
import {AuthContext} from '../context/AuthContext';

export const Authpage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const {loading, error, request, clearError} = useHttp();
  const [form, setForm] = useState({email: '', password: ''});

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHandler = event => {setForm({...form, [event.target.name]: event.target.value })};

  const login = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form});
      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  const loginEnterHandler = async (event) => {
    if (event.key === 'Enter') {login()}
  };

  return (
    <div className="form">
      <MetaTags>
        <title>Авторизация</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.4"/>
      </MetaTags>
      <h1>АВТОРИЗАЦИЯ</h1>
      <div className="input-form">
        <input type="text" id="email" name="email" placeholder="Логин" onChange = {changeHandler} value={form.email} onKeyPress={loginEnterHandler}/>
      </div>
      <div className="input-form">
        <input type="password" id="password" name="password" placeholder="Пароль" onChange = {changeHandler} value={form.password} onKeyPress={loginEnterHandler}/>
      </div>
      <div className="input-form">
        <input type="submit" value="Вход" onClick = {login} disabled = {loading}/>
      </div>
      <a href="/register"> Регистрация </a>
    </div>
  )
};
