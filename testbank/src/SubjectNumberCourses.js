import React from 'react'
import ColorHash from 'color-hash'
import saveBlob from 'downloadjs'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableFooter from '@material-ui/core/TableFooter'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Chip from '@material-ui/core/Chip'
import Zoom from '@material-ui/core/Zoom'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import GetAppIcon from '@material-ui/icons/GetApp'

import SubjectNumberCoursesPagination from './SubjectNumberCoursesPagination'

const colorHash = new ColorHash({ hash: (s) => {
  // from npm string-hash
  let hash = 5381, i = s.length
  while (i) {
    hash = (hash * 33) ^ s.charCodeAt(--i)
  }
  return hash >>> 0
}})

const seasonsEmoji = (season) => {
  if (season === 'Fall') return '🍁'
  else if (season === 'Winter') return '❄️'
  else if (season === 'Spring') return '🌼'
  else if (season === 'Summer') return '☀️'
  return '[ Not a valid season :( ]'
}

const emojiTooltip = (season) => (
  <Tooltip 
    arrow 
    TransitionComponent={Zoom} 
    placement='right' 
    title={season}
  >
    <span>{seasonsEmoji(season)}</span>
  </Tooltip>
)

const termQuarterCompare = (a, b) => {
  if (a.data.quarter === b.data.quarter) return 0
  else if (a.data.quarter === 'Fall') return -1
  else if (b.data.quarter === 'Fall') return 1
  else if (a.data.quarter === 'Winter') return -1
  else if (b.data.quarter === 'Winter') return 1
  else if (a.data.quarter === 'Spring') return -1
  else if (b.data.quarter === 'Spring') return 1
  else if (a.data.quarter === 'Summer') return -1
  else if (b.data.quarter === 'Summer') return 1
  else return a.data.quarter.localeCompare(b.data.quarter)
}

const termCompare = (a, b) => {
  if (a.data.year !== b.data.year) return a.data.year - b.data.year
  else return termQuarterCompare(a, b)
}

const kindCompare = (a, b) => {
  if (a.data.name === b.data.name) { return a.data.number - b.data.number }
  else if (a.data.name === 'Quiz') { return -1 }
  else if (b.data.name === 'Quiz') { return 1 }
  else if (a.data.name === 'Midterm') { return -1 }
  else if (b.data.name === 'Midterm') { return 1 }
  else if (a.data.name === 'Final') { return -1 }
  else if (b.data.name === 'Final') { return 1  }
  else { return a.data.name.localeCompare(b.data.name) }
}

const aggregateFilters = (filterItems) => {
  const professorArr = filterItems.filter(item => item.field === 'professor')
  const kindArr = filterItems.filter(item => item.field === 'kind')
  const termArr = filterItems.filter(item => item.field === 'term')
  return {
    ...(professorArr.length > 0 && { professor: professorArr.map(item => item.data)}),
    ...(kindArr.length > 0 && { kind: kindArr.map(item => item.data)}),
    ...(termArr.length > 0 && { term: termArr.map(item => item.data)})
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(4)
  },
  filterControlsToolbar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  filterAutocomplete: {
    flex: '1 1 100%',
    padding: '0 36px'
  },
}))

export default React.memo((props) => {

  const { ax, handleClickTestInfo, authCB } = props
  const courseSubject = decodeURIComponent(props.courseSubject)
  const courseNumber = decodeURIComponent(props.courseNumber)
  
  const classes = useStyles()

  const [testData, setTestData] = React.useState({ tests: [], count: 0 })
  const loadTests = async (opts) => {
    try {
      const res = await ax.post('/get-tests', {
        course: {
          subject: courseSubject,
          number: courseNumber
        },
        filters: {
          ...opts?.filters
        },
        sort: opts?.sort,
        order: opts?.order,
        page: page,
        limit: rowsPerPage,
      })
      setTestData(res.data)
    } catch(e) {
      console.log(e.response.data.reason)
      if (e.response.status === 401 && e.response.data.reason === 'JWT verification failed') {
        authCB.tokenExpiry()
      }
    }
  }

  const [filterOptions, setFilterOptions] = React.useState([])
  const loadFilterOptions = async () => {
    try {
      const res = await ax.post('/get-filter-options', {
        course: {
          subject: courseSubject,
          number: courseNumber
        }
      })
      const professorsSorted = res.data.professors.map( professor => ({
        field: 'professor', 
        fieldDisplay: 'Professor', 
        data: professor, 
        display: professor.name ? professor.name : '(None)', 
      })).sort( (a, b) => (a.display === null ? -1 : a.display.localeCompare(b.display)))

      const kindsSorted = res.data.kinds.map( kind => ({
        field: 'kind', 
        fieldDisplay: 'Kind', 
        data: kind, 
        display: kind.name + ' ' + (kind.number ? kind.number : '')
      })).sort(kindCompare)

      const termsSorted = res.data.terms.map( term => ({
        field: 'term', 
        fieldDisplay: 'Term', 
        data: term, 
        display: term.year.toString() + ' ' + term.quarter,
      })).sort(termCompare)

      const filterOptionsSorted = [].concat.apply([], [professorsSorted, kindsSorted, termsSorted])
      setFilterOptions(filterOptionsSorted)
    } catch(e) {
      console.log(e.response.data.reason)
      if (e.response.status === 401 && e.response.data.reason === 'JWT verification failed') {
        authCB.tokenExpiry()
      }
    }
  }
  
  const downloadFile = (_id) => async () => {
    try {
      const res = await ax.post('/get-test-file', {
        _id: _id
      }, {
        responseType: 'blob'
      })
      const contentType = res.headers['content-type']
      saveBlob(res.data, _id + '.pdf', contentType)
    } catch(e) {
      console.log(e.response.data.reason)
      if (e.response.status === 401 && e.response.data.reason === 'JWT verification failed') {
        authCB.tokenExpiry()
      }
    }
  }

  const [page, setPage] = React.useState(0)
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenFilterBar = () => {
    if (filterOptions.length === 0) {
      loadFilterOptions()
    }
  }

  const [filterItems, setFilterItems] = React.useState([])
  const handleFilterItemsChange = (event, values) => {
    setPage(0)
    setFilterItems(values)
  }

  React.useEffect(() => {
    if (authCB.isLoggedIn()) {
      loadTests({ filters: aggregateFilters(filterItems) })
    }
  }, [page, rowsPerPage, filterItems.length])

  return (
    <>
      <Typography variant='h2' component='h2'>
        {courseSubject} {courseNumber}
      </Typography>
      <Box className={classes.root}>
        <Paper>
          <Toolbar className={classes.filterControlsToolbar}>
            <Autocomplete
              className={classes.filterAutocomplete}
              autoComplete
              multiple
              id='grouped-filter'
              options={filterOptions}
              groupBy={option => option.fieldDisplay}
              getOptionLabel={option => option.display}
              filterSelectedOptions
              onChange={handleFilterItemsChange}
              renderInput={params => (
                <TextField 
                  {...params} 
                  onClick={handleOpenFilterBar}
                  label='Filter / Search' 
                  variant='outlined' 
                  fullWidth 
                />
              )}
              ChipProps={{ color: 'primary' }}
            />
          </Toolbar>
          <TableContainer>
            <Table className={classes.table} aria-label='test table' aria-labelledby='tableTitle' size='small'>
              <TableHead>
                <TableRow>
                  <TableCell component='th' scope='row'>Identifier</TableCell>
                  <TableCell>Professor</TableCell>
                  <TableCell>Kind</TableCell>
                  <TableCell>Term</TableCell>
                  <TableCell align='right'>Size</TableCell>
                  <TableCell padding='none'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testData.tests.map(test => (
                  <TableRow key={test._id}>
                    <TableCell component='th' scope='row'>
                      <Chip 
                        label={test._id.slice(-6)} 
                        variant='outlined' 
                        size='small' 
                        style={{ color: colorHash.hex(test._id), fontFamily: 'Monospace' }} 
                        onClick={handleClickTestInfo(test._id)}
                      />
                    </TableCell>
                    <TableCell>{test.professor.name || '-'}</TableCell>
                    <TableCell>{test.kind.name + (test.kind.number ? ' ' + test.kind.number : '')}</TableCell>
                    <TableCell>
                      {test.term.year}<span>&ensp;</span>{emojiTooltip(test.term.quarter)}</TableCell>
                    <TableCell align='right'>{test.filesize || '-'}</TableCell>
                    <TableCell padding='none'>
                      <IconButton onClick={downloadFile(test._id)}>
                        <GetAppIcon style={{ fontSize: '18px' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination 
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={3}
                    count={testData.count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={SubjectNumberCoursesPagination}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  )
})
