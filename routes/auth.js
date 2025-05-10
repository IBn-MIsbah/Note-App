const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");
const { isLoggedIn } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "LogIn",
  });
});
router.get("/register", (req, res) => {
  res.render("auth/register", {
    title: "SignUp",
    message: req.flash(),
  });
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.redirect("/login");
    }
    const newUser = new User({ username, email });
    User.register(newUser, password, async (err, user) => {
      if (err) {
        console.error(err.message);
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/register");
        }
      }
      passport.authenticate("local")(req, res, () => {
        req.flash("success", "Registration seccessful!");
        res.redirect("/dashboard");
      });
    });
  } catch (err) {
    req.flash("error", "Registaration failed");
    res.redirect("/register");
  }
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failWithError: true,
  })
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);

router.get(
  "/auth/google/note-app",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("notes");
    if (!user) {
      return res.redirect("/login");
    }
    const displayName = user.username || user.email.split("@")[0];
    res.render("notes/dashboard", {
      title: "Dashboard",
      user: {
        ...user.toObject(),
        displayName,
      },
      notes: user.notes,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      res.status(500).send("error loging out");
    }
    res.redirect("/");
  });
});

router.get("/notes/create", isLoggedIn, (req, res) => {
  res.render("notes/create-note", {
    user: req.user,
    messages: {
      error: req.flash("error"),
      success: req.flash("success"),
    },
  });
});

module.exports = router;
