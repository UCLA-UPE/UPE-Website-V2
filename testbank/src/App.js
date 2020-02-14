import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { useRoutes, useRedirect, navigate, A } from 'hookrouter'

// material-ui components
import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'

// custom components
import TestbankAppBar from './TestbankAppBar'
import TestbankBody from './TestbankBody'
import InfoBar from './InfoBar'

// style
import './App.css'

// magic constants
const apiUrl = `http://localhost:8080`

// apparently there should be only one top-level router
const routes = {
  '*': () => (authToken, apiUrl, authCB) => (
    <>
      <TestbankAppBar token={authToken} apiUrl={apiUrl} authCB={authCB} />
      <TestbankBody token={authToken} apiUrl={apiUrl} />
    </>
  ),
}

function App() {

  const match = useRoutes(routes)

  const [authToken,  setAuthToken]  = React.useState('asdf')
  const [sbOpen,     setSbOpen]     = React.useState(false)
  const [sbSeverity, setSbSeverity] = React.useState()
  const [sbMessage,  setSbMessage]  = React.useState()

  React.useEffect(() => {
    // console.log('authToken: ' + authToken)
  })

  const showInfoBar = (severity, message) => {
    setSbSeverity(severity)
    setSbMessage(message)
    setSbOpen(true)
  }
  const authCB = (event, response) => {
    if (event === 'login') {
      if (response.status === 200) {
        showInfoBar('success', 'Login Success!')
        setAuthToken(response.data.token)
        console.log(response.data.token)
      }
      else {
        showInfoBar('error', 'Login Failed')
      }
    }
    else if (event === 'signup') {
      if (response.status === 200) {
        showInfoBar('success', 'Signed Up!')
        setAuthToken(response.data.token)
      }
      else {
        showInfoBar('error', 'Email Address Exists')
      }
    }
    else if (event === 'token') {

    }
  }
  
  return (
    <>
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
      <CssBaseline />
      {match(authToken, apiUrl, authCB)}
      <InfoBar open={sbOpen} setOpen={setSbOpen} severity={sbSeverity} message={sbMessage} />
    </>
  )
}

export default App
