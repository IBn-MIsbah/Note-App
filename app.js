import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res)=>{
    res.render('notes/create-note')
})
app.get('/login', (req, res)=>{
    res.render('auth/login')
})
app.listen(port, (err)=>{
    if(err) throw err;
    console.log(`Server active on http://localhost:${port}`)
})