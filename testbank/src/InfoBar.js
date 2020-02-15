import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export default function InfoBar(props) {

  const { open, setOpen, message, severity } = props
  const handleClose = (event, reason) => {
    // if (reason === 'clickaway') {
    //   return
    // }
    setOpen(false)
    console.log(open)
  }
  return (
    <Snackbar key={'info-snackbar'} open={open} autoHideDuration={1000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  )
}
