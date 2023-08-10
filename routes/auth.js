const router = require("express").Router();
const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

//get sing-up page
router.get("/sign-up", isLoggedOut, (req, res, next) => {
  if (req.session.currentUser) {
    res.render("sign-up", { loggedIn: true });
  } else {
    res.render("sign-up");
  }
});

//post sign-up page
router.post("/sign-up", isLoggedOut, (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;
  User.findOne({ username: username })
    .then((foundUser) => {
      if (foundUser) {
        res.render("sign-up", {
          errorMessage: "Username has been taken, use another one",
        });
      } else {
        bcrypt
          .genSalt(saltRounds)
          .then((salt) => bcrypt.hash(password, salt))
          .then((hashedPassword) => {
            console.log("hashedPassword", hashedPassword);
            return User.create({
              username: username,
              password: hashedPassword,
            });
          })
          .then((userFromDb) => {
            const { username } = userFromDb;
            req.session.currentUser = { username };
            console.log("username ===========>>>>", username);
            res.redirect("/profile");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => console.log(err));
});

// get profile page
router.get("/profile", isLoggedIn, (req, res, next) => {
  if (req.session.currentUser) {
    User.findOne({ username: req.session.currentUser.username })
      .then((foundUser) => {
        foundUser.loggedIn = true;
        res.render("profile", { foundUser, loggedIn: true });
      })
      .catch((err) => console.log(err));
  } else {
    res.render("profile", {loggedIn: false});
  }
});

// get login page
router.get("/login", isLoggedOut, (req, res, next) => {
  if (req.session.currentUser) {
    res.render("login", { loggedIn: true });
  } else {
    res.render("login", {loggedIn: false});
  }
});

// post login page
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  //back-end form validation
  if (!username || !password) {
    res.render("/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((foundUser) => {
      console.log("user", foundUser);
      //check if user found in DB
      if (!foundUser) {
        res.render("login", {
          errorMessage: "Username is not registered. Try with other username.",
        });
      } else if (bcrypt.compareSync(password, foundUser.password)) {
        //check if the input password matches the one stored in the db
        const { username } = foundUser;
        req.session.currentUser = { username };
        res.redirect("/profile");
      } else {
        //if enter password does not maktch user password
        red.render("login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((err) => console.log(err));
});

// get main page
router.get("/main", (req, res, next) => {
  if (req.session.currentUser){
    res.render("main",  { loggedIn: true });
  } else {
    res.render("main",  { loggedIn: false });
  }
});

// get private page
router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private", { loggedIn: true });
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;