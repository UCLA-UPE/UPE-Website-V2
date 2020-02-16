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

const ax = axios.create({ baseURL: apiUrl })

export default () => {

  const match = useRoutes(routes)

  const setToken = (token) => {
    ax.interceptors.request.use(config => {
      config.headers = { 'Authorization': `Bearer ${token}` }
      return config
    }, error => Promise.reject(error))
    setIsLoggedIn(true)
  }
  const unsetToken = () => {
    ax.interceptors.request.use(config => {
      delete config.headers.Authorization
      return config
    }, error => Promise.reject(error))
    setIsLoggedIn(false)
  }

  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setToken(token)
      // showInfoBar('success', 'Login Success!')
    }
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
    login: (res, remember) => {
      if (res.status === 200) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        showInfoBar('success', 'Login Success!')
      }
      else {
        showInfoBar('error', 'Login Failed')
      }
    },
    logout: (res) => {
      if (res.status === 200) {
        unsetToken()
        localStorage.removeItem('token')
        navigate('/')
        showInfoBar('success', 'Logged Out')
      }
      else {
        showInfoBar('error', 'Logout Failed')
      }
    },
    signup: (res, remember) => {
      if (res.status === 200) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        showInfoBar('success', 'Signed Up!')
      }
      else {
        showInfoBar('error', 'Email Address Exists')
      }
    },
    tokenExpiry: () => {
      console.log('Token expired.')
      unsetToken()
      localStorage.removeItem('token')
      navigate('/')
      showInfoBar('error', 'Token Expired')
    },
    tokenDNE: () => {
      // navigate('/')
      // showInfoBar('error', 'Unauthorized')
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
