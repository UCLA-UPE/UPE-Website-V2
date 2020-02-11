import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from 'react-router-dom'

import TestSubject from './TestSubject'
import TestSubjects from './TestSubjects'

const useStyles = makeStyles(theme => ({
  root: {
  },
  grid: {
    padding: theme.spacing(4)
  }
}));

export default function TestbankBody(props) {
  
  const classes = useStyles()

  return (
    <Router>
      <Container maxWidth='md' className={classes.root}>
        <Switch>
          <Route path='/tests/:test'>
            <TestSubject />
          </Route>
          <Route path='/tests'>
            <TestSubjects />
          </Route>
        </Switch>
      </Container>
    </Router>
  )
}
