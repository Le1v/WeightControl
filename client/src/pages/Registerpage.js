import React, {useState, useEffect, useContext} from 'react';
import MetaTags from 'react-meta-tags';
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';
import {AuthContext} from '../context/AuthContext';

export const Registerpage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const {loading, error, request, clearError} = useHttp();
  const [form, setForm] = useState({email: '', password: '', secondpass: ''});

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHandler = event => {setForm({...form, [event.target.name]: event.target.value })};

  const register = async () => {
    if(form.password == form.secondpass) {
      try {
        const data = await request('/api/auth/register', 'POST', {...form});
        message(data.message);
      } catch (e) {}
    }
    else {message("ПАРОЛИ НЕ СОВПАДАЮТ!")}
  };


  const registerEnterHandler = async (event) => {
    if (event.key == 'Enter') {register()}
  };

  return (
    <div className="form">
      <MetaTags>
        <title>Регистрация</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.4"/>
      </MetaTags>
      <h1>РЕГИСТРАЦИЯ</h1>
      <div className="input-form">
        <input type="text" id="email" name="email" placeholder="Адрес эл. почты" onChange = {changeHandler} value={form.email} onKeyPress={registerEnterHandler}/>
      </div>
      <div className="input-form">
        <input type="password" id="password" name="password" placeholder="Придумайте пароль" onChange = {changeHandler} value={form.password} onKeyPress={registerEnterHandler}/>
      </div>
      <div className="input-form">
        <input type="password" id="password" name="secondpass" placeholder="Повторите пароль" onChange = {changeHandler} value={form.secondpass} onKeyPress={registerEnterHandler}/>
      </div>
      <div className="input-form">
        <input type="submit" value="Регистрация" onClick = {register} disabled = {loading}/>
      </div>
    </div>
  )
};
