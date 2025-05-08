import express from 'express';
import passport from 'passport';
import User from '../models/user.js'

const router = express.Router()

router.get('/register', (req, res)=>{
    res.render('auth/register')
})
router.get('/login',(req, res)=>{
    res.render('auth/login')
})
router.post('/register', async(req,res)=>{
   const {name, email, password} = req.body
   const newUser = new User({name, email})

   User.register(newUser, password, (err, user)=>{
    if(err){
        console.error(err)
        return res.render('auth/register')
    }
    passport.authenticate('local')(req, res, ()=>{
        res.redirect('/notes/dashboard');
    })
   })
})

export default router;