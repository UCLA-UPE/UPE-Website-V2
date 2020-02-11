import React from 'react'
import Container from '@material-ui/core/Container'
import axios from 'axios'
import { useRoutes, navigate } from 'hookrouter'

import TestbankGrid from './TestbankGrid'
import SubjectGrid from './SubjectGrid'

const routes = {
  '/testbank': () => (p)                     =>                 <TestbankGrid 
                                                                  token={p.token} 
                                                                  apiUrl={p.apiUrl} 
                                                                  handleClick={p.handleClickTestbank} 
                                                                />,
  '/testbank/:subject': ({ subject }) => (p) =>                 <SubjectGrid 
                                                                  token={p.token} 
                                                                  apiUrl={p.apiUrl} 
                                                                  subject={subject} 
                                                                  handleClick={p.handleClickSubject}
                                                                />,
  '/testbank/:subject/:number': ({ subject, number }) => (p) => <TestList
                                                                  token={p.token} 
                                                                  apiUrl={p.apiUrl} 
                                                                  subject={subject} 
                                                                  handleClick={p.handleClickSubject} 
                                                                />
}

export default function TestbankBody(props) {
  
  const match = useRoutes(routes)

  const handleClickTestbank = (courseSubject) => () => {
    navigate(`/testbank/${courseSubject}`)
  }

  const handleClickSubject = (courseSubject, courseNumber) => () => {
    navigate(`/testbank/${courseSubject}/${courseNumber}`)
  }

  return (
    <Container maxWidth='md' >
      {typeof(match) == 'function' && match({
        ...props,
        handleClickTestbank: handleClickTestbank,
        handleClickSubject: handleClickSubject,
      }) || navigate(`/`)}
    </Container>
  )
}
