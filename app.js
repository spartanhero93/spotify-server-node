const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')
require('dotenv').config()
const cors = require('cors')
const axios = require('axios')
const app = express()

app.use(cors())
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: schema,
//     graphiql: true,
//   })
// )

app.get('/api', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://accounts.spotify.com/authorize?client_id=${
        process.env.CLIENT_ID
      }&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&state=34fFs29kd09`
    )
    console.log('data sent')
    res.send(data)
  } catch (error) {
    console.log(error)
  }
})

app.listen(3001, () => console.log('Now browse to localhost:3001/graphql'))
