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

export default function SubjectGrid(props) {
  
  const classes = useStyles()

  React.useEffect(() => {
    loadSubject()
  }, [props.nav.length])

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

  const handleClick = async (courseNumber) => () => {
    // console.log(courseNumber)
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
