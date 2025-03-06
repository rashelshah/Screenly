const mongoose = require('mongoose');
const URI = "mongodb://localhost:27019/Data"

async function connectToMongo(){
await mongoose.connect(URI)
.then(()=> console.log('Connected to MongoDB'))
.catch(err => console.log(err));
}
module.exports = connectToMongo;