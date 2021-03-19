const {Router} = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.get(
  '/show',
  auth,
  async(req, res) => {
  try {
    const inp = await User.find({_id: req.user.userId});
    res.json([inp[0].inpmass, inp[0].date]);
  } catch (e) {res.status(500).json({message: "ЧТО-ТО ПОШЛО НЕ ТАК..."})};
});

router.post(
  '/insert',
  auth,
  async(req, res) => {
  if (Number.parseInt(req.body.inpmass) > 0 && Number.parseInt(req.body.inpmass) < 700) {
    try {
      const inp = await User.find({_id: req.user.userId});
      if (inp) {
        var date = new Date();
        await User.updateOne({_id: req.user.userId },{ $push: { inpmass: Number.parseInt(req.body.inpmass), date: date}});
        res.json({message: 'УСПЕШНО ДОБАВЛЕНО!'});
      }
    } catch (e) {res.status(500).json({message: "ЧТО-ТО ПОШЛО НЕ ТАК..." + e.message})}
  } else {res.json({message: 'НЕКОРРЕКТНЫЕ ДАННЫЕ!'})}
});

module.exports = router;
