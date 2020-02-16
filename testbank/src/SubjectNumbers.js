import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import GridCard from './GridCard'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
}))

export default React.memo((props) => {

  const { ax, authCB, handleClick } = props
  const courseSubject = decodeURIComponent(props.courseSubject)
  
  const classes = useStyles()

  React.useEffect(() => {
    if (authCB.isLoggedIn()) {
      loadGrid()
    }
  }, [])

  const [gridItems, setGridItems] = React.useState([])
  const loadGrid = async () => {
    const res = await ax.post('/get-subject-numbers', { subject: courseSubject })
    setGridItems(res.data)
  }

  return (
    <>
      <Typography variant="h2" component="h2">
        {courseSubject}
      </Typography>
      <Grid container spacing={2} className={classes.root}>
        {gridItems.map(courseNumber => (
          <Grid item
            onClick={handleClick(courseSubject, courseNumber.course_number)}
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
})
