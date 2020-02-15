import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PublishIcon from '@material-ui/icons/Publish';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useRoutes, useRedirect, navigate, A } from 'hookrouter'

import LoginPopover from './LoginPopover'
import ProfilePopover from './ProfilePopover'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

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
}

export default function TestbankAppBar(props) {

  const { token, apiUrl, authCB } = props

  const classes = useStyles()
  const match = useRoutes(routes)

  React.useEffect(() => { console.log('token:' + token) })

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {match}
          {token ?
            <ProfilePopover token={token} apiUrl={apiUrl} authCB={authCB} />
          :
            <LoginPopover apiUrl={apiUrl} authCB={authCB} />
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}
