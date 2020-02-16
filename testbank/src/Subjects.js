import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import GridCard from './GridCard'

const useStyles = makeStyles(theme => ({
  root: {
  },
  grid: {
    padding: theme.spacing(4)
  }
}))

export default React.memo((props) => {
  
  const { ax, authCB, handleClick } = props
  const classes = useStyles()

  React.useEffect(() => {
    if (authCB.isLoggedIn()) {
      loadGrid()
    }
  }, [])

  const [gridItems, setGridItems] = React.useState([])
  const loadGrid = async () => {
    const res = await ax.post('/get-subjects')
    setGridItems(res.data)
  }

  return (
    <>
      <Typography variant="h2" component="h2">
        
      </Typography>
      <Grid container spacing={2} className={classes.grid}>
        {gridItems.map(subject => (
          <Grid item
            onClick={handleClick(subject.course_subject)}
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
})
