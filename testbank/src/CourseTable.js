import React from 'react'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import axios from 'axios'
import ColorHash from 'color-hash'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableFooter from '@material-ui/core/TableFooter'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
// import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Chip from '@material-ui/core/Chip'
import Zoom from '@material-ui/core/Zoom'
import Badge from '@material-ui/core/Badge'
import Autocomplete from '@material-ui/lab/Autocomplete'

import FormControl from '@material-ui/core/FormControl'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'

import FilterListIcon from '@material-ui/icons/FilterList'
import GetAppIcon from '@material-ui/icons/GetApp'

import CourseTablePaginationActions from './CourseTablePaginationActions'

import saveBlob from 'downloadjs'

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
  chipColor: (color) => {
    colorPrimary: '#' + color
  },
  filterControlsToolbar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  filterChipsToolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
    marginBottom: theme.spacing(3)
  },
  filterTitle: {
      flex: '0 0 auto',
     marginRight: theme.spacing(2)
  },
  filterAutocomplete: {
    flex: '1 1 100%',
    padding: '0 36px'
  },
  filterChip: {
    margin: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))

export default function CourseTable(props) {

  const { apiUrl, token, handleClickTestInfo } = props
  const courseSubject = decodeURIComponent(props.courseSubject)
  const courseNumber = decodeURIComponent(props.courseNumber)
  
  const classes = useStyles()

  const [testData, setTestData] = React.useState({ tests: [], count: 0 })
  const loadTests = async (opts) => {
    console.log('---')
    try {
      const body = {
        token: token,
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
      }
      console.log(body)
      const res = await axios.post(apiUrl + '/get-tests', body)
      // console.log(res.data)
      setTestData(res.data)
    } catch(e) {
      console.log(e)
    }
  }

  const [filterOptions, setFilterOptions] = React.useState([])
  const loadFilterOptions = async () => {
    try {
      const res = await axios.post(apiUrl + '/get-filter-options', {
        course: {
          subject: courseSubject,
          number: courseNumber
        }
      })
      const professorsSorted = res.data.professors.map( professor => ({
        field: 'professor', 
        fieldDisplay: 'Professor', 
        data: professor, 
        // query: [{ 'professor.name': professor.name }],
        display: professor.name ? professor.name : '(None)', 
      })).sort( (a, b) => (a.display === null ? -1 : a.display.localeCompare(b.display)))

      const kindsSorted = res.data.kinds.map( kind => ({
        field: 'kind', 
        fieldDisplay: 'Kind', 
        data: kind, 
        // query: [{ 'kind.name': kind.name }, { 'kind.number': kind.number }],
        display: kind.name + ' ' + (kind.number ? kind.number : '')
      })).sort(kindCompare)

      const termsSorted = res.data.terms.map( term => ({
        field: 'term', 
        fieldDisplay: 'Term', 
        data: term, 
        // query: [{ 'term.year': term.year }, { 'term.quarter': term.quarter }],
        display: term.year.toString() + ' ' + term.quarter,
      })).sort(termCompare)

      const filterOptionsSorted = [].concat.apply([], [professorsSorted, kindsSorted, termsSorted])
      setFilterOptions(filterOptionsSorted)
    } catch(e) {
      console.log(e)
    }
  }
  
  const downloadFile = (_id) => async () => {
    try {
      const res = await axios.post(apiUrl + '/get-test-file', {
        token: token,
        _id: _id
      }, {
        responseType: 'blob'
      })
      const contentType = res.headers['content-type']
      saveBlob(res.data, _id + '.pdf', contentType)
    } catch(e) {
      if (e.response) {
        console.log(e.response)
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
  React.useEffect(() => {
    loadTests({
      filters: aggregateFilters(filterItems)
    })
  }, [page, rowsPerPage])

  const [showFilter, setShowFilter] = React.useState(false)
  const handleShowFilterBar = () => {
    if (!showFilter) {
      if (filterOptions.length === 0) {
        loadFilterOptions()
      }
      setShowFilter(true)
    }
    else {
      setShowFilter(false)
    }
  }

  const [selectedFilterItem, setSelectedFilterItem] = React.useState(null)
  const handleSelectedFilterItemChange = (event, values) => {
    setSelectedFilterItem(values)
  }

  const [filterItems, setFilterItems] = React.useState([])
  const handleFilterItemAdd = (event) => {
    event.preventDefault()
    setPage(0)
    const set = new Set(filterItems)
    if (selectedFilterItem && !set.has(selectedFilterItem)) {
      setFilterItems([...filterItems, selectedFilterItem])
    }
  }
  const handleFilterItemDelete = (itemToDelete) => () => {
    setPage(0)
    for (let i = 0; i < filterItems.length; ++i) {
      if (filterItems[i].field === itemToDelete.field && filterItems[i].display === itemToDelete.display) {
        setFilterItems([...filterItems.slice(0, i), ...filterItems.slice(i + 1)])
        return
      }
    }
  }
  React.useEffect(() => {
    loadTests({
      filters: aggregateFilters(filterItems)
    })
  }, [filterItems.length])

  return (
    <>
      <Typography variant='h2' component='h2'>
        {courseSubject} {courseNumber}
      </Typography>
      <Box className={classes.root}>
        <Paper>
          <Toolbar className={classes.filterControlsToolbar}>
            <Typography variant='h6' id='tableTitle' className={classes.filterTitle}>
              All Tests
            </Typography>
            {showFilter ? 
              <form className={classes.filterAutocomplete} onSubmit={handleFilterItemAdd} noValidate>
                <Autocomplete
                  id='grouped-filter'
                  size='small'
                  options={filterOptions}
                  groupBy={option => option.fieldDisplay}
                  getOptionLabel={option => option.display}
                  onChange={handleSelectedFilterItemChange}
                  renderInput={params => (
                    <TextField {...params} autoFocus label='Filter / Search' variant='outlined' fullWidth />
                  )}
                />
              </form>
            : null }
            <Tooltip title='Filter list'>
              <IconButton aria-label='filter list' onClick={handleShowFilterBar}>
                <Badge badgeContent={'+'} color='default'>
                  <FilterListIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Toolbar className={classes.filterChipsToolbar}>
            {filterItems.map(item => (
              <Chip 
                key={item.display}
                color='primary'
                variant='outlined'
                className={classes.filterChip}
                label={item.fieldDisplay + ': ' + item.display} 
                onDelete={handleFilterItemDelete(item)}
              />
            ))}
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
                    ActionsComponent={CourseTablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  )
}
