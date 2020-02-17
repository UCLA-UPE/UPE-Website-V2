import React from 'react'
import { useRoutes, useRedirect, navigate, A } from 'hookrouter'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import MenuIcon from '@material-ui/icons/Menu'
import PublishIcon from '@material-ui/icons/Publish'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import LoginPopover from './LoginPopover'
import ProfilePopover from './ProfilePopover'
import UploadTestDialog from './UploadTestDialog'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  navItem: {
    marginRight: theme.spacing(3),
  },
}))

const Rarr = () => <span>&ensp;&rarr;&ensp;</span>
const Breadcrumb = (props) => (
  <Typography variant="h6" style={{ flexGrow: 1 }}>
    <A href='/' style={{ textDecoration: 'none', color: 'inherit' }}>
      Home
    </A>
    {props.trail.map(t => (
      <span key={t.path}>
        <Rarr />
        {t.path ?
          <A href={t.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            {t.text}
          </A>
        :
          t.text
        }
      </span>
    ))}
  </Typography>
)

const routes = {
  '/': () => (
    <Breadcrumb
      trail={[]}
    />
  ),
  '/test/:id': ({ id }) => (
    <Breadcrumb
      trail={[
        { path: null, text: 'Test' },
        { path: '/test/' + id, text: id }
      ]}
    />
  ),
  '/peruse': () => (
    <Breadcrumb
      trail={[
        { path: '/peruse', text: 'Peruse' }
      ]}
    />
  ),
  '/peruse/:subject': ({ subject }) => (
    <Breadcrumb
      trail={[
        { path: '/peruse', text: 'Peruse' },
        { path: '/peruse/' + subject, text: decodeURIComponent(subject) },
      ]}
    />
  ),
  '/peruse/:subject/:id': ({ subject, id }) => (
    <Breadcrumb
      trail={[
        { path: '/peruse', text: 'Peruse' },
        { path: '/peruse/' + subject, text: decodeURIComponent(subject) },
        { path: '/peruse/' + subject + '/' + id, text: decodeURIComponent(id) },
      ]}
    />
  ),
  '/profile': () => (
    <Breadcrumb
      trail={[
        { path: '/profile', text: 'Profile' }
      ]}
    />
  ),
  
}

export default React.memo((props) => {

  const { ax, authCB } = props

  const classes = useStyles()
  const match = useRoutes(routes)

  const [credits, setCredits] = React.useState()

  React.useEffect(() => {
    if (authCB.isLoggedIn()) {
      loadCredits()
    }
  }, [])

  const loadCredits = async () => {
    const res = await ax.post('/get-profile')
    setCredits(res.data.testbankCredits)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {match}
          {authCB.isLoggedIn() ?
            <>
              <Box className={classes.navItem}><Typography variant="button">Credits: {credits}</Typography></Box>
              <UploadTestDialog ax={ax} authCB={authCB} className={classes.navItem} />
              <ProfilePopover ax={ax} authCB={authCB} className={classes.navItem} />
            </>
          :
            <LoginPopover ax={ax} authCB={authCB} className={classes.navItem} />
          }
        </Toolbar>
      </AppBar>
    </div>
  )
})
