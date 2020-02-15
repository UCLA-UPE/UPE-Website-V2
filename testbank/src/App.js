import React from 'react'
import ReactDOM from 'react-dom'
import { useRoutes, navigate, } from 'hookrouter'

import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'

import Navbar from './Navbar'
import Body from './Body'
import InfoSnackbar from './InfoSnackbar'

// style
import './App.css'

// magic constants
const apiUrl = `http://localhost:8080`

// apparently there should be only one top-level router
const routes = {
  // INFO: '/testbank' is set as base path in index.js
  '*': () => (authToken, apiUrl, authCB) => (
    <>
      <Navbar token={authToken} apiUrl={apiUrl} authCB={authCB} />
      <Body token={authToken} apiUrl={apiUrl} authCB={authCB} />
    </>
  ),
}

export default () => {

  const match = useRoutes(routes)

  const [authToken,  setAuthToken] = React.useState()
  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
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
  const authCB = (event, data) => {
    if (event === 'login') {
      if (data.res.status === 200) {
        setAuthToken(data.res.data.token)
        localStorage.setItem('token', data.res.data.token)
        showInfoBar('success', 'Login Success!')
      }
      else {
        showInfoBar('error', 'Login Failed')
      }
    }
    if (event === 'logout') {
      if (data.res.status === 200) {
        setAuthToken(null)
        localStorage.removeItem('token')
        navigate('/')
        showInfoBar('success', 'Logged Out')
      }
      else {
        showInfoBar('error', 'Logout Failed')
      }
    }
    else if (event === 'signup') {
      if (data.res.status === 200) {
        setAuthToken(data.res.data.token)
        localStorage.setItem('token', data.res.data.token)
        showInfoBar('success', 'Signed Up!')
      }
      else {
        showInfoBar('error', 'Email Address Exists')
      }
    }
    else if (event === 'tokenExpiry') {
      setAuthToken(null)
      localStorage.removeItem('token')
      navigate('/')
      showInfoBar('error', 'Token Expired')
    }
    else if (event === 'tokenDNE') {
      // navigate('/')
      // showInfoBar('error', 'Unauthorized')
    }
  }
  
  return (
    <>
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
      <CssBaseline />
      {match(authToken, apiUrl, authCB)}
      <InfoSnackbar open={sbOpen} setOpen={setSbOpen} message={sbMessage} severity={sbSeverity} />
    </>
  )
}
