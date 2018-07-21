const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
app.use(express.static(path.join(__dirname,'/app')));
router.get('/api',(req,res)=>{
    res.status(200).send({message: 'hello I am the API'})
})
app.use(router);
app.listen(3000,() => console.log('Example app listening on port 3000!'));