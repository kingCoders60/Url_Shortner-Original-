const express = require("express");
const urlRoute = require('./routes/url');
const {connectToMongoDB} = require('./connect')
const app = express();
const PORT = 8001;

app.use(express.json())
connectToMongoDB('mongodb+srv://allien10101010:76RHXohMWeYn1UeB@cluster0.edelp.mongodb.net/shivamNewDatabase')
.then(()=>console.log('Connected!'))
app.use("/url",urlRoute);

app.listen(PORT,()=>{
    console.log(`Server started at port no. ${PORT}`);
})