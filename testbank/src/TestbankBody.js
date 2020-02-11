import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'

import SubjectCard from './SubjectCard'

const useStyles = makeStyles(theme => ({
  root: {
  },
  grid: {
    padding: theme.spacing(4)
  }
}));

export default function TestbankBody(props) {
  
  const [subjects, setSubjects] = React.useState([])
  const classes = useStyles()

  React.useEffect(() => {
    loadSubjects()
  })

  const loadSubjects = async () => {
    try {
      const res = await axios.post(props.apiUrl + '/subject-counts', {
        token: props.token
      })
      setSubjects(res.data)
    } catch(e) {
      if (e.response) {
        console.log(e.response)
      }
    }
  }

  return (
    <Container maxWidth="md" className={classes.root}>
      <Grid container spacing={2} className={classes.grid}>
        {subjects.map(subject => (
          <Grid item key={subject.course_subject} md={4}>
            <SubjectCard subject={subject} />
          </Grid>
          ))}
      </Grid>
    </Container>
  )
}
