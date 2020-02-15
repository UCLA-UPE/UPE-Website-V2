import React from 'react'
import axios from 'axios'
import { navigate } from 'hookrouter'

import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

export default React.memo((props) => {

  const { token, apiUrl, authCB } = props
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleLogout = async (event) => {
    try {
      const res = await axios.post(apiUrl + '/logout', {
        token: token
      })
      authCB('logout', { res: res })
    } catch(e) {
      authCB('logout', { res: e.response })
    }
  }

  return (
    <div>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <AccountCircleIcon style={{ color: 'white' }} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box className={classes.paper}>
          <Button onClick={() => navigate('/profile')}>Profile</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </Box>
      </Popover>
    </div>
  )
})
