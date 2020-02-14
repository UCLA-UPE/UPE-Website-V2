import React from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Popover from '@material-ui/core/Popover'
import axios from 'axios'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="https://upe.seas.ucla.edu/">
        UCLA UPE
      </Link>{' '}
      {' © '}
      {new Date().getFullYear()}
    </Typography>
  )
}

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  popover_button: {
    margin: theme.spacing(1, 0, 2),
  },
  copyright: {
    margin: theme.spacing(3, 5),
  },
}))

export default function LoginButton(props) {
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

  const [email, setEmail] = React.useState(null)
  const [password, setPassword] = React.useState(null)

  const handleLogin = async (event) => {
    event.preventDefault() // prevent form submit from refreshing page
    try {
      const res = await axios.post(props.apiUrl + '/login', {
        email: email,
        password: password
      })
      props.authCB('login', res)
    } catch(e) {
      if (e.response) {
        props.authCB('login', e.response)
      }
    }
  }
  const handleSignup = async (event) => {
    try {
      const res = await axios.post(props.apiUrl + '/signup', {
        email: email,
        password: password
      })
      props.authCB('signup', res)
    } catch(e) {
      if (e.response) {
        props.authCB('signup', e.response)
      }
    }
  }

  return (
    <div>
      <Button aria-describedby={id} color="inherit" onClick={handleClick}>
        Log In
      </Button>
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
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <form className={classes.form} onSubmit={handleLogin} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item xs>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.popover_button}
                  >
                    Log In
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleSignup}
                    variant="contained"
                    color="secondary"
                    className={classes.popover_button}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
              
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </form>
          </div>
          <Box mt={4} mb={2}>
            <Copyright />
          </Box>
        </Container>
      </Popover>
    </div>
  )
}
