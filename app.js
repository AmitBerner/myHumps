const express = require('express')
const Steve = require('./ramadanSteve.js')
let container
setInterval(() =>{container = Steve.requestGame("Overwatch")},1000*1*60)
let app = express()
app.get('/',function(req,res){
    res.json(JSON.stringify(container))
})
app.listen(3000)