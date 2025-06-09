//import the module
const mongoose = require('mongoose');
//if error happen it’s catch here
main().catch(err => console.log(err));
async function main() {
//the connect function of mongoose get the connection string to local or remote db
await mongoose.connect(
'mongodb+srv://TamiYanai:TamiYanaiwow@matching.azkfp.mongodb.net/matching');
console.log('connect!!')
}

module.exports=mongoose