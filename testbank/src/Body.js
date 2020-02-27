import React from 'react'
import { useRoutes, useRedirect, navigate } from 'hookrouter'

import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Home from './Home'
import Subjects from './Subjects'
import SubjectNumbers from './SubjectNumbers'
import CourseTests from './CourseTests'
import Profile from './Profile'

const routes = {
  '/': () => (p) => (
    <Home ax={p.ax} authCB={p.authCB} />
  ),
  '/peruse': () => (p) => (
    <Subjects 
      ax={p.ax} handleClick={p.handleClickSubject} 
      authCB={p.authCB}
    />
  ),
  '/peruse/:courseSubject': ({ courseSubject }) => (p) => (
    <SubjectNumbers 
      ax={p.ax} courseSubject={decodeURIComponent(courseSubject)} 
      handleClick={p.handleClickNumber} authCB={p.authCB}
    />
  ),
  '/peruse/:courseSubject/:courseNumber': ({ courseSubject, courseNumber }) => (p) => (
    <CourseTests
      ax={p.ax} authCB={p.authCB} handleClickTestInfo={p.handleClickTestInfo}
      course={{ subject: decodeURIComponent(courseSubject), number: decodeURIComponent(courseNumber) }}
    />
  ),
  '/test/:id': ({ id }) => (p) => (
    <Typography>TODO</Typography>
    // <TestInfo />
  ),
  '/profile': () => (p) => (
    <Profile
      ax={p.ax} authCB={p.authCB}
    />
  ),
}

export default React.memo((props) => {

  const { ax, authCB } = props
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
          ax: ax,
          handleClickSubject: handleClickSubject,
          handleClickNumber: handleClickNumber,
          handleClickTestInfo: handleClickTestInfo,
          authCB: authCB
        }) || navigate('/')}
      </Box>
    </Container>
  )
})
