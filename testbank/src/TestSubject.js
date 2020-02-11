import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from 'react-router-dom'

import SubjectCard from './SubjectCard'

const useStyles = makeStyles(theme => ({
  root: {
  },
  grid: {
    padding: theme.spacing(4)
  }
}));

/**
 * 3 views: Subjects > Numbers > Tests
 */
export default function TestbankBody(props) {
  
  const classes = useStyles()

  React.useEffect(() => {
    loadSubjects()
    // console.log(props.nav)
  }, [props.nav.length])

  const [courseSubjects, setCourseSubjects] = React.useState([])
  const loadSubjects = async () => {
    try {
      const res = await axios.post(props.apiUrl + '/get-subjects', {
        token: props.token
      })
      setCourseSubjects(res.data)
      // console.log(res.data)
    } catch(e) {
      if (e.response) {
        console.log(e.response)
      }
    }
  }

  const [courseSubjectNumbers, setCourseSubjectNumbers] = React.useState([])
  const loadSubject = async (subjectToLoad) => {
    try {
      const res = await axios.post(props.apiUrl + '/get-subject', {
        token: props.token,
        subject: subjectToLoad
      })
      setCourseSubjectNumbers(res.data)
      console.log(res.data)
    } catch(e) {
      if (e.response) {
        console.log(e.response)
      }
    }
  }

  const [selectedCourseSubject, setSelectedCourseSubject] = React.useState()
  const handleCourseSubjectClick = (clickedCourseSubject) => async () => {
    // console.log(clickedCourseSubject)
    setSelectedCourseSubject(clickedCourseSubject)
    await loadSubject(clickedCourseSubject)
  }

  const handleCourseNumberClick = async (clickedCourseNumber) => () => {
    // console.log(clickedCourseNumber)
  }

  return (
    <>
      <Typography variant="h2" component="h2">
        {selectedCourseSubject}
      </Typography>
      <Grid container spacing={2} className={classes.grid}>
        {courseSubjectNumbers.map(subjectNumber => (
          <Grid item key={subjectNumber.course_number} md={4}>
            <SubjectCard 
              title={subjectNumber.course_number} 
              subItems={[]} 
              documentCount={subjectNumber.count} 
              handleClick={null} 
            />
          </Grid>
          ))}
      </Grid>
    </>
  )
}
