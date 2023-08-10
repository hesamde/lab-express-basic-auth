
const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//get sing-up page
router.get("/sign-up", (req, res, next) => {
  res.render("sign-up");
});

router.post("/sign-up", (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      console.log("hashedPassword", hashedPassword);
      return User.create({ username: username, password: hashedPassword });//
    })
    .then((userFromDb) => {
      res.redirect("/sign-up");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;