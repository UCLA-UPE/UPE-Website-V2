import React from 'react'
import ReactDOM from 'react-dom'
import { useRoutes, navigate, } from 'hookrouter'
import os from 'os'
import axios from 'axios'

import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'

import Navbar from './Navbar'
import Body from './Body'
import InfoSnackbar from './InfoSnackbar'

// style
import './App.css'

const API_PORT = 8080
const apiUrl = 'http://' + os.hostname() + ':' + API_PORT
console.log('api url is set to ' + apiUrl)

// apparently there should be only one top-level router
const routes = {
  // INFO: '/testbank' is set as base path in index.js
  '*': () => (ax, authCB) => (
    <>
      <Navbar ax={ax} authCB={authCB} />
      <Body ax={ax} authCB={authCB} />
    </>
  ),
}

// create an axios instance to configure things
const ax = axios.create({ baseURL: apiUrl })

export default () => {

  const match = useRoutes(routes)

  const [authInterceptor, setAuthInterceptor] = React.useState(null)
  const login = (token, remember) => {
    if (!authInterceptor) {
      const int = ax.interceptors.request.use(config => {
        config.headers = { 'Authorization': `Bearer ${token}` }
        return config
      }, error => Promise.reject(error))
      setAuthInterceptor(int)
    }
    if (remember) {
      localStorage.setItem('token', token)
    }
    setIsLoggedIn(true)
  }
  const logout = () => {
    if (authInterceptor) {
      axios.interceptors.request.eject(authInterceptor)
      setAuthInterceptor(null)
    }
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    navigate('/')
  }

  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      login(token)
      showInfoBar('success', 'Login Success!')
    }
    ax.interceptors.response.use(
      (response) => response, // Do nothing to success (2xx) responses
      (error) => {
        // Intercept error (300+) responses
        console.log('ERROR INTERCEPTED')
        if (error.response) { // these are HTTP errors sent by the server
          if (error.response.status === 401 && error.response.data.reason === 'Authorization header missing') {
            console.log('Authorization header missing.')
            // TODO?
            return Promise.reject(error)
          }
          else if (error.response.status === 401 && error.response.data.reason === 'JWT verification failed') {
            authCB.tokenExpiry()
            return Promise.reject(error)
          }
          // TODO: handle other failures, like failed signup due to existing email
        }
        throw error
      }
    )
  }, [])

  const [sbOpen,     setSbOpen]     = React.useState(false)
  const [sbSeverity, setSbSeverity] = React.useState()
  const [sbMessage,  setSbMessage]  = React.useState()

  const showInfoBar = (severity, message) => {
    setSbSeverity(severity)
    setSbMessage(message)

    // InfoSnackbar causes re-render of Body when it auto closes
    // this will be an issue with hookrouter is resolved
    // many of the showInfoBar() calls are disabled because of this
    setSbOpen(true)
  }

  const authCB = {
    login: (token, remember) => {
      login(token, remember)
      showInfoBar('success', 'Login Success!')
    },
    logout: () => {
      logout()
      showInfoBar('success', 'Logged Out')
    },
    signup: (token, remember) => {
      login(token, remember)
      showInfoBar('success', 'Signed Up!')
    },
    tokenExpiry: () => {
      logout()
      showInfoBar('error', 'Token Invalid')
      navigate('/')
    },
    tokenDNE: () => {
      logout()
      showInfoBar('error', 'Unauthorized')
      navigate('/')
    },
    isLoggedIn: () => { return isLoggedIn },
  }
  
  return (
    <>
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
      <CssBaseline />
      {match(ax, authCB)}
      <InfoSnackbar open={sbOpen} setOpen={setSbOpen} message={sbMessage} severity={sbSeverity} />
    </>
  )
}
