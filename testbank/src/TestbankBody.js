import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import axios from 'axios'
import { useRouter } from 'hookrouter'

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
    <Container maxWidth='md' className={classes.root}>
      <TestSubjects {...props} />
    </Container>
  )
}
