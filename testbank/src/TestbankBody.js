import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import axios from 'axios'
import { useRouter } from 'hookrouter'

import TestbankGrid from './TestbankGrid'
import SubjectGrid from './SubjectGrid'

const useStyles = makeStyles(theme => ({
  root: {
  },
  grid: {
    padding: theme.spacing(4)
  }
}));

const routes = {
  '/testbank': () => <TestbankGrid {...props} />,
  '/testbank/:subject': ({ subject }) => <SubjectGrid subject={subject} {...props} />,
  // '/testbank/:subject/:number': ({ subject, number }) => <Contact subject={subject} {...props} />
}

export default function TestbankBody(props) {
  
  const classes = useStyles()

  return (
    <Container maxWidth='md' className={classes.root}>

    </Container>
  )
}
