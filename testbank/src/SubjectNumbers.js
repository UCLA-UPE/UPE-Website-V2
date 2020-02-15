import React from 'react'
import axios from 'axios'

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

  const { apiUrl, token, authCB, handleClick } = props
  const courseSubject = decodeURIComponent(props.courseSubject)
  
  const classes = useStyles()

  React.useEffect(() => {
    if (token) {
      loadGrid()
    } else {
      authCB('tokenDNE')
    }
  }, [])

  const [gridItems, setGridItems] = React.useState([])
  const loadGrid = async () => {
    try {
      const res = await axios.post(apiUrl + '/get-subject-numbers', {
        token: token,
        subject: courseSubject
      })
      setGridItems(res.data)
    } catch(e) {
      if (e.response.status === 401) {
        authCB('tokenExpiry')
      }
    }
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
