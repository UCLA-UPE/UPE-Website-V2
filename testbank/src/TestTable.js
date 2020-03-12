import React from 'react'
import ColorHash from 'color-hash'
import saveBlob from 'downloadjs'
import { aggregateFilters } from './util'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableFooter from '@material-ui/core/TableFooter'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Chip from '@material-ui/core/Chip'
import Zoom from '@material-ui/core/Zoom'
import GetAppIcon from '@material-ui/icons/GetApp'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'

import TestTableFilterBar from './TestTableFilterBar'
import TestTablePagination from './TestTablePagination'

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

const useStyles = makeStyles(theme => ({

}))

export default React.memo((props) => {

  // you can pass in prefilters to TestTable.
  //   for example, when looking for "all tests for MATH 32A",
  //   the prefilter would be { course: [{ subject: 'MATH', number: '32A' }] }.
  //   this automatically hides the "course" column from the table,
  //   and also hides the single "MATH 32A" course filter from the filter bar.
  // getHidden is a Boolean prop that bypasses the 'visible' attribute on tests.
  //   the API server checks the provided credentials and gives back 
  //   as many tests as the user is authorized to view.
  const { ax, authCB, handleClickTestInfo, preFilters } = props
  const getHidden = props.getHidden || false
  const classes = useStyles()

  const [testData, setTestData] = React.useState({ tests: [], count: 0 })
  const loadTests = async (opts) => {
    const res = await ax.post('/get-tests', {
      filters: opts.filters,
      sort: opts?.sort,
      order: opts?.order,
      page: page,
      limit: rowsPerPage,
      getHidden: getHidden
    })
    setTestData(res.data)
  }

  const [filterItems, setFilterItems] = React.useState([])
  const handleFilterItemsChange = (event, values) => {
    setPage(0)
    setFilterItems(values)
  }

  const downloadFile = (_id) => async () => {
    const res = await ax.post(
      '/get-test-file', 
      { _id: _id }, 
      { responseType: 'blob' }
    )
    const contentType = res.headers['content-type']
    saveBlob(res.data, _id + '.pdf', contentType)
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
    if (authCB.isLoggedIn()) {
      loadTests({ filters: aggregateFilters(preFilters, filterItems) })
    }
  }, [page, rowsPerPage, filterItems.length])

  // TODO: when needed, change this to be more robust, allowing multiple prefilters and dynamically setting visibility of columns
  const showProfessorCol = preFilters[0].field !== 'Professor'
  const showCoursesCol = preFilters[0].field !== 'Courses'

  return (
    <Paper>
      <TestTableFilterBar ax={ax} authCB={authCB} preFilters={preFilters} handleFilterItemsChange={handleFilterItemsChange} getHidden={getHidden} />
      <TableContainer>
        <Table className={classes.table} aria-label='test table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Identifier</TableCell>
              {showProfessorCol ? <TableCell>Professor</TableCell> : null}
              {showCoursesCol ? <TableCell>Course</TableCell> : null}
              <TableCell>Kind</TableCell>
              <TableCell>Term</TableCell>
              <TableCell align='right'>Size</TableCell>
              {getHidden ? <TableCell>Visible</TableCell> : null}
              <TableCell padding='none'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testData.tests.map(test => (
              <TableRow key={test._id}>
                <TableCell>
                  <Chip 
                    label={test._id.slice(-6)} 
                    variant='outlined' 
                    size='small' 
                    style={{ color: colorHash.hex(test._id), fontFamily: 'Monospace' }} 
                    onClick={handleClickTestInfo(test._id)}
                  />
                </TableCell>
                {showProfessorCol ? <TableCell>{test.professor.name || '-'}</TableCell> : null}
                {showCoursesCol ? <TableCell>{test.course.subject} {test.course.number}</TableCell> : null}
                <TableCell>{test.kind.name + (test.kind.number ? ' ' + test.kind.number : '')}</TableCell>
                <TableCell>
                  {test.term.year}<span>&ensp;</span>{emojiTooltip(test.term.quarter)}</TableCell>
                <TableCell align='right'>{test.filesize || '-'}</TableCell>
                {getHidden ? <TableCell>{test.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}</TableCell> : null}
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
                ActionsComponent={TestTablePagination}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  )
})