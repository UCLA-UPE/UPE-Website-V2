import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'

import GridCard from './GridCard'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
}));

export default function SubjectGrid(props) {

  const { apiUrl, token } = props
  const subject = decodeURIComponent(props.subject)
  
  const classes = useStyles()

  React.useEffect(() => {
    loadGrid()
  }, [])

  const [gridItems, setGridItems] = React.useState([])
  const loadGrid = async () => {
    try {
      const res = await axios.post(apiUrl + '/get-subject-numbers', {
        token: token,
        subject: subject
      })
      setGridItems(res.data)
      console.log(res.data)
    } catch(e) {
      if (e.response) {
        console.log(e.response)
      }
    }
  }

  return (
    <>
      <Typography variant="h2" component="h2">
        {subject}
      </Typography>
      <Grid container spacing={2} className={classes.root}>
        {gridItems.map(courseNumber => (
          <Grid item
            onClick={props.handleClick(subject, courseNumber.course_number)}
            key={courseNumber.course_number}
            md={4}
          >
            <GridCard 
              title={courseNumber.course_number} 
              subItems={[]} 
              documentCount={courseNumber.count} 
            />
          </Grid>
          ))}
      </Grid>
    </>
  )
}
