import React from 'react'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import axios from 'axios'
import ColorHash from 'color-hash'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Chip from '@material-ui/core/Chip';
import Zoom from '@material-ui/core/Zoom';

import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import GetAppIcon from '@material-ui/icons/GetApp';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import TestListItem from './TestListItem'

const colorHash = new ColorHash({ hash: (s) => {
  // npm string-hash
  let hash = 5381, i = s.length
  while (i) {
    hash = (hash * 33) ^ s.charCodeAt(--i)
  }
  return hash >>> 0
}})

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(4)
  },
  chipColor: (color) => {
    colorPrimary: '#' + color
  },
  toolbarRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  toolbarTitle: {
    flex: '1 1 100%',
  },
}));

const emojiTooltip = (title, emoji) => (
  <Tooltip 
    arrow 
    TransitionComponent={Zoom} 
    placement="right" 
    title={title}
  >
    <span>{emoji}</span>
  </Tooltip>
)

const seasonsEmoji = (season) => {
  let emoji
  if (season === 'Fall') emoji = '🍁'
  else if (season === 'Winter') emoji = '❄️'
  else if (season === 'Spring') emoji = '🌼'
  else if (season === 'Summer') emoji = '☀️'
  return emojiTooltip(season, emoji)
}

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
  
  const downloadFile = (_id) => async () => {
    try {
      const res = await axios.post(props.apiUrl + '/get-test-file', {
        token: props.token,
        _id: _id
      })
      console.log(res)
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
          <Toolbar className={classes.toolbarRoot}>
            <Typography className={classes.toolbarTitle} variant="h6" id="tableTitle">
              All Tests
            </Typography>
            <Tooltip title="Filter list">
              <IconButton aria-label="filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <TableContainer>
            <Table className={classes.table} aria-label="test table" aria-labelledby="tableTitle" size='small'>
              <TableHead>
                <TableRow>
                  <TableCell component="th" scope="row">Identifier</TableCell>
                  <TableCell>Kind</TableCell>
                  <TableCell>Professor</TableCell>
                  <TableCell>Term</TableCell>
                  <TableCell align='right'>Size</TableCell>
                  <TableCell padding='none'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listItems.map(test => (
                  <TableRow key={test._id}>
                    <TableCell component="th" scope="row">
                      <Chip 
                        label={test._id.slice(-6)} 
                        variant='outlined' 
                        size='small' 
                        style={{ color: colorHash.hex(test._id) }} 
                        onClick={props.handleClickTestInfo(test._id)}
                      />
                    </TableCell>
                    <TableCell>{test.kind.name + (test.kind.number ? ' ' + test.kind.number : '')}</TableCell>
                    <TableCell>{test.professor.name || '-'}</TableCell>
                    <TableCell>
                      {test.term.year}<span>&emsp;</span>{seasonsEmoji(test.term.quarter)}</TableCell>
                    <TableCell align='right'>{test.filesize || '-'}</TableCell>
                    <TableCell padding='none'>
                      <IconButton onClick={downloadFile(test._id)}>
                        <GetAppIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  )
}
