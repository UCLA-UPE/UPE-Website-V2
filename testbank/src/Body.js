import React from 'react'
import axios from 'axios'
import { useRoutes, useRedirect, navigate } from 'hookrouter'

import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Home from './Home'
import Subjects from './Subjects'
import SubjectNumbers from './SubjectNumbers'
import SubjectNumberCourses from './SubjectNumberCourses'

const routes = {
  '/': () => (p) => (
    <Home token={p.token} />
  ),
  '/peruse': () => (p) => (
    <Subjects 
      token={p.token} apiUrl={p.apiUrl} handleClick={p.handleClickSubject} 
      authCB={p.authCB}
    />
  ),
  '/peruse/:courseSubject': ({ courseSubject }) => (p) => (
    <SubjectNumbers 
      token={p.token} apiUrl={p.apiUrl} courseSubject={courseSubject} 
      handleClick={p.handleClickNumber} authCB={p.authCB}
    />
  ),
  '/peruse/:courseSubject/:courseNumber': ({ courseSubject, courseNumber }) => (p) => (
    <SubjectNumberCourses
      token={p.token} apiUrl={p.apiUrl} courseSubject={courseSubject}
      courseNumber={courseNumber} handleClickTestInfo={p.handleClickTestInfo}
      authCB={p.authCB}
    />
  ),
  '/test/:id': ({ id }) => (p) => (
    <Typography>TODO</Typography>
    // <TestInfo />
  ),
}

export default React.memo((props) => {

  const { token, apiUrl, authCB } = props
  const match = useRoutes(routes)

  const handleClickSubject = (courseSubject) => () => {
    navigate(`/testbank/peruse/${courseSubject}`)
  }
  const handleClickNumber = (courseSubject, courseNumber) => () => {
    navigate(`/testbank/peruse/${courseSubject}/${courseNumber}`)
  }
  const handleClickTestInfo = (testID) => () => {
    navigate(`/testbank/test/${testID}`)
  }
  return (
    <Container maxWidth='md' mb='15px' >
      <Box m={3}>
        {typeof(match) == 'function' && match({
          token: token,
          apiUrl: apiUrl,
          handleClickSubject: handleClickSubject,
          handleClickNumber: handleClickNumber,
          handleClickTestInfo: handleClickTestInfo,
          authCB: authCB
        }) || navigate(`/`)}
      </Box>
    </Container>
  )
})
