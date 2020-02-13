import React from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'
import { useRoutes, useRedirect, navigate } from 'hookrouter'

// import DataDisplayGrid from './DataDisplayGrid'
// import EnhancedTable from './EnhancedTable'
import CourseTable from './CourseTable'
import TestbankGrid from './TestbankGrid'
import SubjectGrid from './SubjectGrid'
import SubjectNumberTestList from './SubjectNumberTestList'

const routes = {
  '/testbank/test/:id': ({ id }) => (p) => (
    <Typography>TODO</Typography>
    // <TestInfo />
  ),
  '/testbank/peruse': () => (p) => (
    <TestbankGrid 
      token={p.token} apiUrl={p.apiUrl}
      handleClick={p.handleClickSubject} 
    />
  ),
  '/testbank/peruse/:subject': ({ subject }) => (p) => (
    <SubjectGrid 
      token={p.token} apiUrl={p.apiUrl} subject={subject} 
      handleClick={p.handleClickNumber} 
    />
  ),
  '/testbank/peruse/:subject/:number': ({ subject, number }) => (p) => (
    <CourseTable
      token={p.token} apiUrl={p.apiUrl} subject={subject}
      number={number} handleClickTestInfo={p.handleClickTestInfo}
    />
  ),
}

export default function TestbankBody(props) {
  
  useRedirect('/', '/testbank/peruse')
  useRedirect('/testbank', '/testbank/peruse')
  const match = useRoutes(routes)

  const handleClickSubject = (subject) => () => {
    navigate(`/testbank/peruse/${subject}`)
  }
  const handleClickNumber = (subject, number) => () => {
    navigate(`/testbank/peruse/${subject}/${number}`)
  }
  const handleClickTestInfo = (testID) => () => {
    navigate(`/testbank/test/${testID}`)
  }
  return (
    <Container maxWidth='md' mb='15px' >
      <Box m={3}>
        {typeof(match) == 'function' && match({
          ...props,
          handleClickSubject: handleClickSubject,
          handleClickNumber: handleClickNumber,
          handleClickTestInfo: handleClickTestInfo,
        }) || navigate(`/`)}
      </Box>
    </Container>
  )
}
