import React from 'react'
import ColorHash from 'color-hash'

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
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Chip from '@material-ui/core/Chip'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'

import AddVisibilityFilterDialog from './AddVisibilityFilterDialog'

const colorHash = new ColorHash({ hash: (s) => {
  // from npm string-hash
  let hash = 5381, i = s.length
  while (i) {
    hash = (hash * 33) ^ s.charCodeAt(--i)
  }
  return hash >>> 0
}})

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))

export default React.memo((props) => {

  const { ax, authCB, handleClickTestInfo, professor } = props
  const classes = useStyles()

  const displayFilterData = (field, name) => {
    switch (name) {
      case 'test_id':
        return field.comparator === '*' ? '*' : (
          <Chip 
            label={field.value.slice(-6)} 
            variant='outlined' 
            size='small' 
            style={{ color: colorHash.hex(field.value), fontFamily: 'Monospace' }} 
            onClick={handleClickTestInfo(field.value)}
          />
        )
      case 'course':
        return field.comparator === '*' ? '*' : field.value.subject + ' ' + field.value.number
      case 'kind':
        return field.comparator === '*' ? '*' : field.value.name + (field.value.number ? ' ' + field.value.number : '')
      case 'term':
        return field.comparator === '*' ? '*' : <span>{field.comparator}&emsp;{field.value.year} {field.value.quarter}</span>
    }
  }

  const [filterData, setFilterData] = React.useState([])
  const loadFilters = async () => {
    const res = await ax.post('/get-test-visibility-filters')
    setFilterData(res.data)
  }

  const applyFilters = async () => {
    const res = await ax.post('/apply-test-visibility-filters')
  }
  
  const removeFilter = async (filter_id) => {
    const res = await ax.post('/remove-test-visibility-filters', { 
      filterId: filter_id 
    })
    applyFilters()
    loadFilters()
  }

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const handleDialogClose = () => {
    setDialogOpen(false)
    applyFilters()
    loadFilters()
  }

  React.useEffect(() => {
    if (authCB.isLoggedIn()) {
      loadFilters()
    }
  }, [])

  return (
    <Paper>
      <TableContainer>
        <Table className={classes.table} aria-label='test visibility filter table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Test ID</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Kind</TableCell>
              <TableCell>Term</TableCell>
              <TableCell padding='none'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterData.length > 0 ? 
              filterData.map(filter => (
                <TableRow key={filter._id}>
                  <TableCell>{displayFilterData(filter.test_id, 'test_id')}</TableCell>
                  <TableCell>{displayFilterData(filter.course, 'course')}</TableCell>
                  <TableCell>{displayFilterData(filter.kind, 'kind')}</TableCell>
                  <TableCell>{displayFilterData(filter.term, 'term')}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => removeFilter(filter._id)}>
                      <DeleteIcon style={{ fontSize: '18px' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            :
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  <span style={{ color: 'gray' }}>You have no visibility filters set.</span>
                </TableCell>
              </TableRow>
            }
            <TableRow>
              <TableCell colSpan={5} align='center' onClick={() => setDialogOpen(true)}>
                <Button
                  startIcon={<AddIcon />}
                  fullWidth={true}
                >
                  Add Filter
                </Button>
              </TableCell>
              <AddVisibilityFilterDialog ax={ax} open={dialogOpen} handleClose={handleDialogClose} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
})
