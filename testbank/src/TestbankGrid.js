import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
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

export default function TestbankGrid(props) {
  
  const classes = useStyles()

  React.useEffect(() => {
    loadGrid()
  }, [])

  const [gridItems, setGridItems] = React.useState([])
  const loadGrid = async () => {
    try {
      const res = await axios.post(props.apiUrl + '/get-subjects', {
        token: props.token
      })
      setGridItems(res.data)
      // console.log(res.data)
    } catch(e) {
      if (e.response) {
        console.log(e.response)
      }
    }
  }

  return (
    <>
      <Typography variant="h2" component="h2">
        
      </Typography>
      <Grid container spacing={2} className={classes.grid}>
        {gridItems.map(subject => (
          <Grid item
            onClick={props.handleClick(subject.course_subject)}
            key={subject.course_subject}
            md={4}
          >
            <GridCard
              title={subject.course_subject}
              subItems={subject.course_numbers}
              documentCount={subject.count}
            />
          </Grid>
          ))}
      </Grid>
    </>
  )
}
