const express = require("express");
const flash = require("express-flash");
const router = express.Router();
const Note = require("../models/note");
const User = require("../models/user");
const { isLoggedIn } = require("../middleware/authMiddleware");


router.get("/create", isLoggedIn, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send("Unauthorized: User not found");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found in database");
    }
    console.log(user);
    res.render("notes/create-note", { user });
  } catch (err) {
    console.error(err.stack);
    console.error(err.message);
  }
});

router.post("/create", isLoggedIn, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      req.flash("error", "Title and content are required");
      return res.redirect("/notes/create");
    }
    const newNote = new Note({
      title: title.trim(),
      content: content.trim(),
      user: req.user._id,
    });

    await newNote.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { notes: newNote._id },
    });

    req.flash("success", "Note created successfully!");
    res.redirect("/dashboard"); // Better to redirect to dashboard
  } catch (err) {
    console.error(err.message);
    req.flash("error", "Failed to create note");
    res.redirect("/notes/create");
  }
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send("Note not found");

    res.render('notes/create-note', {
      note,
      user: req.user,
      messages: {
        err: "",
        success: ""
      }
    })
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/update/:id", isLoggedIn, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: "Title and content required" });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title: title.trim(), content: content.trim(), updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.redirect('/dashboard')
  } catch (err) {
    res.status(500).json({ error: "Server error updating note" });
  }
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { notes: req.params.id },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting note" });
  }
});

module.exports = router;
