require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

// port is 27019
// Connect to MongoDB

const URI = process.env.MONGO_URI;

async function connectToMongo(){
await mongoose.connect(URI)
.then(()=> console.log('Connected to MongoDB'))
.catch(err => console.log(err));
}
module.exports = connectToMongo;