import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
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
    <Grid container spacing={2} className={classes.grid}>
      {gridItems.map(subject => (
        <Grid item key={subject.course_subject} md={4}>
          <GridCard
            title={subject.course_subject}
            subItems={subject.course_numbers}
            documentCount={subject.count}
            handleClick={props.handleClick(subject.course_subject)}
          />
        </Grid>
        ))}
    </Grid>
  )
}
