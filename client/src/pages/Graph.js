import React, {useContext, useState} from 'react';
import MetaTags from 'react-meta-tags';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {useMessage} from '../hooks/message.hook';
import {useHttp} from '../hooks/http.hook';
import {format, parseISO} from 'date-fns';

export const Graph = () => {
  const message = useMessage();
  const {loading, error, request, clearError} = useHttp();
  const {token} = useContext(AuthContext);
  const history = useHistory();
  const [form, setForm] = useState({days: '', months: '', years: ''});
  const storageInfoName = 'userInfo';
  const storageDeltaName = 'userDelta';
  const data = JSON.parse(localStorage.getItem(storageInfoName));
  const delta = JSON.parse(localStorage.getItem(storageDeltaName));
  var showValues = [];
  var newData = [];
  const pushing = (iter) => {
    showValues.push({name: format(new Date(data.dates[iter]), "MMM, d"), weight: data.weights[iter], pv: 2400, amt: 2400});
  };
  if (data && data.weights && data.dates) {
    if(delta && delta.years < 1000 && delta.months < 12000 && delta.days < 365500){
      var today = new Date();
      for (let j = 0; j<data.dates.length; j++) {
        let newdate = new Date(data.dates[j]);
        newData.push(String(newdate.getDate()) + '.' + String(newdate.getMonth()) + '.' + String(newdate.getFullYear()));
      };
      const ind = newData.indexOf(String(today.getDate() - delta.days) + '.' + String(today.getMonth() - delta.months) + '.' + String(today.getFullYear() - delta.years));
      if(ind != -1 && delta.days != -1) {
        for (let i = ind; i < data.dates.length; i++) {pushing(i)};
      };
      if (ind == -1 && delta.days != -1) {
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - delta.days);
        startDate.setMonth(startDate.getMonth() - delta.months);
        startDate.setFullYear(startDate.getFullYear() - delta.years);
        for (let nearDate = new Date(startDate); nearDate < new Date(); nearDate.setDate(nearDate.getDate() + 1)) {
          var nearInd = newData.indexOf(String(nearDate.getDate()) + '.' + String(nearDate.getMonth()) + '.' + String(nearDate.getFullYear()));
          if (nearInd != -1) {
            for (let p = nearInd; p < newData.length; p++) {pushing(p)};
            break;
          };
        };
      };
      if(delta.days == -1){
        for (let q = 0; q < data.dates.length; q++) {pushing(q)};
    };
  };
};

  const Change_time = async(days, months, years) => {
    try {
      const data = await request('/api/info/show', 'GET', null, {Authorization: token});
      localStorage.setItem(storageDeltaName, JSON.stringify({days: days, months: months, years: years}));
    } catch (e) {message(e.message)};
  };

  const Change_on_week = async(event) => {Change_time(7,0,0)};
  const Change_on_two_weeks = async(event) => {Change_time(14,0,0)};
  const Change_on_month = async(event) => {Change_time(0,1,0)};
  const Change_on_halfyear = async(event) => {Change_time(0,6,0)};
  const Change_on_year = async(event) => {Change_time(0,0,1)};
  const Change_on_all = async(event) => {Change_time(-1,0,0)};

  const GraphChangeHandler = (event) => {setForm({...form, [event.target.name]: event.target.value })};

  const Build = async(event) => {
    var days_count = 0;
    var months_count = 0;
    var years_count = 0;
    if(form && form.days) { var days_count = Number.parseInt(form.days)};
    if(form && form.months) { var months_count = Number.parseInt(form.months)};
    if(form && form.years) { var years_count = Number.parseInt(form.years)};
    Change_time(days_count, months_count, years_count);
  };

  var weightValues = [];
  for(let w = 0; w < showValues.length; w++) {weightValues.push(showValues[w].weight)}

  const CustomTooltip = ({ active, payload, label }) => {
	if (active) {
    var label = label + ", " + String(new Date().getFullYear());
    try {
  		return (
  			<div className="tooltip">
          <h4>{format(new Date(label), "MMMM, d, yyyy, eeee")}</h4>
          <p>{payload[0].value}</p>
  			</div>
  	  )
    } catch (e) {let err = e};
  };
   return null;
 };

  return (
    <div className="form">
      <MetaTags>
        <title>График</title>
        <meta name="viewport" content="width=device-width, initial-scale=0.1"/>
      </MetaTags>
      <h1>ГРАФИК</h1>
      <div className="graph">
        <LineChart width={window.document.body.clientWidth - 50} height={document.documentElement.scrollHeight*0.59} data={showValues}>
          <Line type="monotone" dataKey="weight" stroke="#73f224" activeDot={{ r: 5 }}/>
          <CartesianGrid stroke="#c227a8" strokeDasharray="5 1"/>
          <XAxis dataKey="name" />
          <YAxis dataKey="weight" domain={[Math.min(...weightValues)-5, Math.max(...weightValues)+5]}/>
          <Tooltip content={<CustomTooltip />}/>
        </LineChart>
      </div>
      <div className="input-graph-form">
          <input type="submit" value="НЕДЕЛЯ" onClick = {Change_on_week} disabled = {loading}/>
          <input type="submit" value="2 НЕДЕЛИ" onClick = {Change_on_two_weeks} disabled = {loading}/>
          <input type="submit" value="МЕСЯЦ" onClick = {Change_on_month} disabled = {loading}/>
          <input type="submit" value="ПОЛГОДА" onClick = {Change_on_halfyear} disabled = {loading}/>
          <input type="submit" value="ГОД" onClick = {Change_on_year} disabled = {loading}/>
          <input type="submit" value="ВЕСЬ ПЕРИОД" onClick = {Change_on_all} disabled = {loading}/>
      </div>
      <div className="input-graph-text">
          <input type="text" id="days" name="days" placeholder="Количество дней" onChange = {GraphChangeHandler} value={form.days}/>
          <input type="text" id="months" name="months" placeholder="Количество месяцев" onChange = {GraphChangeHandler} value={form.months}/>
          <input type="text" id="years" name="years" placeholder="Количество лет" onChange = {GraphChangeHandler} value={form.years}/>
          <input type="submit" value="ПОСТРОИТЬ" onClick = {Build} disabled = {loading}/>
      </div>
      <div className="a-graph">
        <a href="/information"> Вернуться </a>
      </div>
    </div>
  )
};
