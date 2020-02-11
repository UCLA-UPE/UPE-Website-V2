import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'

import './App.css'

import ButtonAppBar from './ButtonAppBar'

const apiUrl = `http://localhost:8080`

export default function App() {

  // state hooks
  const [users, setUsers] = React.useState([])
  const [token, setToken] = React.useState(null)

  // effect hooks
  React.useEffect(() => { loadUsers() })

  // routines
  const loadUsers = async () => {
    const res = await axios.get(apiUrl + '/users')
    setUsers(res.data)
  }
  
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <CssBaseline />
      <ButtonAppBar apiUrl={apiUrl} />
      <Typography variant="h1" component="h2" gutterBottom>
        h1. Heading
      </Typography>
    </>
  )
}
