import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import TestTable from './TestTable'

export default React.memo((props) => {

  const { ax, handleClickTestInfo, authCB, course } = props
  
  return (
    <>
      <Typography variant='h2' component='h2'>
        {course.subject} {course.number}
      </Typography>
      <TestTable ax={ax} handleClickTestInfo={handleClickTestInfo} authCB={authCB} preFilters={{ course: course }} />
    </>
  )
})
