const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  inpmass:[{type: Number}],
  date: [{type: Date, default: Date.now}],
  owner: {type: Types.ObjectId, ref:'User'}
});

module.exports = model(name = 'Input', schema);
