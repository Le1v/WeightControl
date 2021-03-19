const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({extended: true}));

app.use(fn = '/api/auth', require('./routs/auth.routs'));
app.use(fn = '/api/info', require('./routs/info.routs'));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))});
};

const PORT = config.get('port') || 5000;

async function start() {
  try {
    await mongoose.connect(config.get('url'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    app.listen(PORT, () => console.log("WORKING ON PORT", PORT, "..."));
  } catch (e) {
    console.log('ERROR ', e.message);
    process.exit(code = 1);
  }
};

start();
