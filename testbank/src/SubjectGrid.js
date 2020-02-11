import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'

import GridCard from './GridCard'

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
    loadGrid()
  }, [])

  const [gridItems, setGridItems] = React.useState([])
  const loadGrid = async () => {
    try {
      console.log(props.subject)
      const res = await axios.post(props.apiUrl + '/get-subject', {
        token: props.token,
        subject: props.subject
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
        {props.subject}
      </Typography>
      <Grid container spacing={2} className={classes.grid}>
        {gridItems.map(courseNumber => (
          <Grid item key={courseNumber.course_number} md={4}>
            <GridCard 
              title={courseNumber.course_number} 
              subItems={[]} 
              documentCount={courseNumber.count} 
              handleClick={props.handleClick(props.subject, courseNumber.course_number)} 
            />
          </Grid>
          ))}
      </Grid>
    </>
  )
}
