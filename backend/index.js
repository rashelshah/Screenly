require('dotenv').config({ path: './backend/.env' });
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors') 

connectToMongo();
const app = express()
const port = 4000

app.use(cors({
  origin: ["https://screenly-pi.vercel.app"], // Replace with your Vercel URL
  methods: "GET,POST",
  credentials: true
}));
app.use(express.json());


app.use('/api/auth', require('./routes/auth'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})