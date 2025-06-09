const express = require('express')
const donatesR= require('./Routes/donatesR')
const donatorsR= require('./Routes/donatorsR')
const donorsR= require('./Routes/donorsR')
const groupsR= require('./Routes/groupsR')
const connect= require('./db/connect')


const app = express()
const port = 3003
app.use(express.json());//for req.body

app.use('/api/donates',donatesR)
app.use('/api/donators',donatorsR)
app.use('/api/donors',donorsR)
app.use('/api/groups',groupsR)



app.get('/', (req, res) => {
    res.send('Hello World!!!!')
  })
//טיפול בשגיאות שנזרקו
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message }); // Send a response with the error message
});


app.listen(port, ()=>{
    console.log(`succesfull with port${port}`)
})
