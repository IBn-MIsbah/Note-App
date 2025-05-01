import express from 'express';
import mongoose from 'mongoose';
import bodyparser from 'body-parser';

const app = express();

mongoose.connect('mongodb://localhost:27017/notesApp');

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model('Note', noteSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set(express.static('public'))
app.set('view engine', 'ejs');

// Fetch all notes and render them
app.get('/', async (req, res) => {
  const notes = await Note.find();
  res.render('notes/create-note.ejs', { notes, editingNote: null });
});

// Fetch specific note for editing
app.get('/get-note/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.json(note);
});

// Update a note
app.post('/update-note/:id', async (req, res) => {
  const { title, content } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, content });
  res.redirect('/');
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
