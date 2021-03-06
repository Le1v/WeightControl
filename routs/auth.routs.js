const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

router.post(
  '/register',
  [
    check('email', 'EMAIL введен некорректно').isEmail(),
    check('password', 'Минимальная длина пароля - 8 символов').isLength(options = {min: 8})
  ],
  async(req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "НЕКОРРЕКТНЫЕ ДАННЫЕ!"
      })
    };

    const {email, password} = req.body;
    const candidate = await User.findOne({email: email});
    if (candidate) {return res.status(400).json({message: 'ЭТОТ EMAIL УЖЕ ЗАРЕГИСТРИРОВАН'})};
    const hashedpassword = await bcrypt.hash(password, 12);
    const user = new User({email, password: hashedpassword});
    await user.save();
    res.status(201).json({message: "ПОЛЬЗОВАТЕЛЬ УСПЕШНО ЗАРЕГИСТРИРОВАН!"});
  } catch (e) {res.status(500).json({message: "ЧТО-ТО ПОШЛО НЕ ТАК..."})};
});


router.post(
  '/login',
  [
    check('email', 'Введите email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async(req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "НЕКОРРЕКТНЫЕ ДАННЫЕ!"
      })
    };

    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {return res.status(400).json({message: 'EMAIL НЕ НАЙДЕН'})};
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {return res.status(400).json({message: 'НЕПРАВИЛЬНЫЙ ПАРОЛЬ'})};
    const token = jwt.sign(
      {userId: user.id},
      config.get("jwtsecret"),
      {expiresIn: '1h'}
    );
    res.json({token, userId: user.id});
  } catch (e) {res.status(500).json({message: "ЧТО-ТО ПОШЛО НЕ ТАК..."})};
});

module.exports = router;
