import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
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

export default function TestbankGrid(props) {
  
  const classes = useStyles()

  React.useEffect(() => {
    loadSubjects()
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

  const [selectedCourseSubject, setSelectedCourseSubject] = React.useState()
  const handleCourseSubjectClick = (clickedCourseSubject) => async () => {
    // console.log(clickedCourseSubject)
    setSelectedCourseSubject(clickedCourseSubject)
    await loadSubject(clickedCourseSubject)
  }

  return (
    <Grid container spacing={2} className={classes.grid}>
      {courseSubjects.map(subject => (
        <Grid item key={subject.course_subject} md={4}>
          <SubjectCard 
            title={subject.course_subject} 
            subItems={subject.course_numbers} 
            documentCount={subject.count} 
            handleClick={handleCourseSubjectClick(subject.course_subject)} 
          />
        </Grid>
        ))}
    </Grid>
  )
}
