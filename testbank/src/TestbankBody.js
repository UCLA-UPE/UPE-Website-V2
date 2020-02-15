import React from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'
import { useRoutes, useRedirect, navigate } from 'hookrouter'

// import DataDisplayGrid from './DataDisplayGrid'
// import EnhancedTable from './EnhancedTable'
import Home from './Home'
import SubjectGrid from './SubjectGrid'
import TestbankGrid from './TestbankGrid'
import CourseTable from './CourseTable'

const routes = {
  '/': () => (p) => (
    <Home token={p.token} />
  ),
  '/peruse': () => (p) => (
    <TestbankGrid 
      token={p.token} apiUrl={p.apiUrl} handleClick={p.handleClickSubject} 
      authCB={p.authCB}
    />
  ),
  '/peruse/:courseSubject': ({ courseSubject }) => (p) => (
    <SubjectGrid 
      token={p.token} apiUrl={p.apiUrl} courseSubject={courseSubject} 
      handleClick={p.handleClickNumber} authCB={p.authCB}
    />
  ),
  '/peruse/:courseSubject/:courseNumber': ({ courseSubject, courseNumber }) => (p) => (
    <CourseTable
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

        {/* {token ?  */}
        {/*   <TestbankGrid  */}
        {/*     token={token} apiUrl={apiUrl} handleClick={handleClickSubject}  */}
        {/*     authCB={authCB} */}
        {/*   /> */}
        {/* : */}
        {/*   <Home token={token} /> */}
        {/* } */}
      </Box>
    </Container>
  )
})
