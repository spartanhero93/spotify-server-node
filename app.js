const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')
require('dotenv').config()
const cors = require('cors')
const axios = require('axios')
const querystring = require('query-string')
const cookieParser = require('cookie-parser')
const app = express()
const request = require('request')


const redirect_uri = 'http://localhost:3001/callback'
const scope = 'user-read-private user-read-email'

const generateRandomString = length => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const stateKey = 'spotify_auth_state'

app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(cors())

app.get('/login', (req, res) => {
  let state = generateRandomString(16)
  res.cookie(stateKey, state)

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  )
})

app.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    )
  } else {
    res.clearCookie(stateKey)
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString(
            'base64'
          ),
      },
      json: true,
    }

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
          refresh_token = body.refresh_token

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true,
        }

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, body) => {
          console.log(body)
        })

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          '/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        )
      } else {
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token',
            })
        )
      }
    })
  }
})

app.listen(3001, () => console.log('Now browse to localhost:3001/graphql'))
