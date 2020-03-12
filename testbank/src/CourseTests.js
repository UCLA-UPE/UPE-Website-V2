import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import TestTable from './TestTable'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(4)
  }
}))

export default React.memo((props) => {

  const { ax, handleClickTestInfo, authCB, course } = props
  const classes = useStyles()
  
  return (
    <>
      <Typography variant='h2' component='h2'>
        {course.subject} {course.number}
      </Typography>
      <Box className={classes.root}>
        <TestTable ax={ax} handleClickTestInfo={handleClickTestInfo} authCB={authCB} preFilters={[{ field: 'Course', data: course }]} />
      </Box>
    </>
  )
})
