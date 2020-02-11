import React from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import axios from 'axios'
import { useRoutes, useRedirect, navigate } from 'hookrouter'

// import DataDisplayGrid from './DataDisplayGrid'
import TestbankGrid from './TestbankGrid'
import SubjectGrid from './SubjectGrid'
import SubjectNumberTestList from './SubjectNumberTestList'

// const routes = {
//   '/testbank': () => (p) =>                                     <TestbankGrid 
//                                                                   token={p.token} 
//                                                                   apiUrl={p.apiUrl} 
//                                                                   handleClick={p.handleClickSubject} 
//                                                                 />,
//   '/testbank/:subject': ({ subject }) => (p) =>                 <SubjectGrid 
//                                                                   token={p.token} 
//                                                                   apiUrl={p.apiUrl} 
//                                                                   subject={subject} 
//                                                                   handleClick={p.handleClickNumber}
//                                                                 />,
//   '/testbank/:subject/:number': ({ subject, number }) => (p) => <SubjectNumberTestList
//                                                                   token={p.token} 
//                                                                   apiUrl={p.apiUrl} 
//                                                                   subject={subject} 
//                                                                   number={number} 
//                                                                   handleClick={p.handleClickTest} 
//                                                                 />
// }

const routes = {
  '/testbank': () => (p) => (
    <TestbankGrid 
      token={p.token} apiUrl={p.apiUrl}
      handleClick={p.handleClickSubject} 
    />
  ),
  '/testbank/:subject': ({ subject }) => (p) => (
    <SubjectGrid 
      token={p.token} apiUrl={p.apiUrl} subject={subject} 
      handleClick={p.handleClickNumber} 
    />
  ),
  '/testbank/:subject/:number': ({ subject, number }) => (p) => (
    <SubjectNumberTestList
      token={p.token} apiUrl={p.apiUrl} subject={subject}
      number={number} handleClick={p.handleClickTest}
    />
  )
}

export default function TestbankBody(props) {
  
  useRedirect('/', '/testbank')
  const match = useRoutes(routes)

  const handleClickSubject = (subject) => () => {
    navigate(`/testbank/${subject}`)
  }

  const handleClickNumber = (subject, number) => () => {
    navigate(`/testbank/${subject}/${number}`)
  }

  const handleClickTest = (testID) => () => {
    navigate(`/testbank/test/${testID}`)
  }

  return (
    <Container maxWidth='md' mb='15px' >
      <Box m={3}>
        {typeof(match) == 'function' && match({
          ...props,
          handleClickSubject: handleClickSubject,
          handleClickNumber: handleClickNumber,
          handleClickTest: handleClickTest,
        }) || navigate(`/`)}
      </Box>
    </Container>
  )
}
