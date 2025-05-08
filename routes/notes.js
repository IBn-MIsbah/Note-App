import express from 'express';
import Note from '../models/note.js'

const router = express.Router();

router.post('/create-note', async(req,res)=>{
    try{
        const newNote = new Note(req.body)
        await newNote.save()
        res.render('notes/create-note')
    } catch(err){
        console.error(err)
    }
})

export default router;