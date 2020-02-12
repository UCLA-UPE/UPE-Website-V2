import React from 'react'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import axios from 'axios'

import TestListItem from './TestListItem'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    padding: theme.spacing(4)
  },
}));

export default function SubjectNumberTestList(props) {
  
  const classes = useStyles()

  React.useEffect(() => {
    loadList()
  }, [])

  const [listItems, setListItems] = React.useState([])
  const loadList = async () => {
    try {
      const res = await axios.post(props.apiUrl + '/get-subject-number-tests', {
        token: props.token,
        subject: props.subject,
        number: props.number
      })
      setListItems(res.data)
    } catch(e) {
      if (e.response) {
        console.log(e.response)
      }
    }
  }

  return (
    <>
      <Typography variant="h2" component="h2">
        {props.subject} {props.number}
      </Typography>
      <Box className={classes.root}>
      <Paper>
        <List dense >
          {listItems.map((test, i) => (
            <div key={test._id}>
              {i ? <Divider absolute component="li" /> : null}
              <TestListItem 
                key={test._id}
                kind={`${test.kind.name} ${test.kind.number || ''}`}
                professor={test.professor.name} 
                term={`${test.term.quarter} ${test.term.year}`}
                handleClick={props.handleClick(props.subject, props.number, test._id)} 
              />
            </div>
          ))}
        </List>
      </Paper>
      </Box>
    </>
  )
}
