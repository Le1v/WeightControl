import React, {useContext, useState} from 'react';
import MetaTags from 'react-meta-tags';
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {useMessage} from '../hooks/message.hook';
import {useHttp} from '../hooks/http.hook';

export const Info = () => {
  const message = useMessage();
  const {loading, error, request, clearError} = useHttp();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const {token} = useContext(AuthContext);
  const [form, setForm] = useState({inpmass: '', date: ''});
  localStorage.removeItem('userDelta');
  const logoutHandler = event => {
    event.preventDefault();
    auth.logout();
    history.push('/');
  };

  const graphHandler = event => {
    const storageName = 'userInfo';
    const storageDeltaName = 'userDelta';
    const timeDelay = (msec) => {
      return new Promise(a => setTimeout(() => a(), msec))
    }
    const dataexport = async() => {
      try {
        const data = await request('/api/info/show', 'GET', null, {Authorization: token});
        localStorage.setItem(storageName, JSON.stringify({weights: data[0], dates: data[1]}));
        localStorage.setItem(storageDeltaName, JSON.stringify({days: -1, months: 0, years: 0}));
        await timeDelay(100);
        event.preventDefault();
        history.push('/graph');
      } catch (e) {message(e.message)}
    };
    dataexport();
  };

  const inpHandler = async(event) => {setForm({...form, [event.target.name]: event.target.value })};

const insertWeight = async(event) => {
    try {
      const data = await request('/api/info/insert', 'POST', {...form}, {Authorization: token});
      message(data.message);
    } catch (e) {message(e.message)}
};

const insertEnter = async(event) =>  {if(event.key == 'Enter') {insertWeight()}};

  return (
    <div className="form">
        <MetaTags>
          <title>Изменение</title>
          <meta name="viewport" content="width=device-width, initial-scale=0.4"/>
        </MetaTags>
        <h1>Ввод значений</h1>
        <div className="input-form">
          <input type="text" id="inpmass" name="inpmass" placeholder="Сегодняшний вес" onChange={inpHandler} value={form.inpmass} onKeyPress={insertEnter}/>
        </div>
        <div className="input-form">
          <input type="submit" value="Добавить" onClick = {insertWeight} disabled = {loading}/>
        </div>
        <div className="input-form">
          <input type="submit" value="График" onClick = {graphHandler} disabled = {loading}/>
        </div>
        <a href="/" onClick={logoutHandler}> Выход</a>
    </div>
  )
};
