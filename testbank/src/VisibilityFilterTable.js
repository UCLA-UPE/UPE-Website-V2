import React from 'react'

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

// preFilters is a dictionary, ex: { course: { name: 'COM SCI', number: 33 } }
// filterItems is an array of the elements present in the filter bar
const aggregateFilters = (preFilters, filterItems) => {
  const courseArr = filterItems.filter(item => item.field === 'course')
  const kindArr = filterItems.filter(item => item.field === 'kind')
  const termArr = filterItems.filter(item => item.field === 'term')
  const professorArr = filterItems.filter(item => item.field === 'professor')
  let filters = {
    ...(courseArr.length > 0 && { course: courseArr.map(item => item.data)}),
    ...(kindArr.length > 0 && { kind: kindArr.map(item => item.data)}),
    ...(termArr.length > 0 && { term: termArr.map(item => item.data)}),
    ...(professorArr.length > 0 && { professor: professorArr.map(item => item.data)}),
  }
  for (const [filterKey, filterValues] of Object.entries(preFilters)) {
    if (filters[filterKey]) {
      filters[filterKey] = [ ...filters[filterKey], ...filterValues ]
    }
    else {
      filters[filterKey] = filterValues
    }
  }
  return filters
}

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))

const displayFilterData = (field, name) => {
  switch (name) {
    case 'test_id':
      return field.comparator === '*' ? '*' : filter.value
    case 'course':
      return field.comparator === '*' ? '*' : filter.value.subject + ' ' + filter.value.number
    case 'kind':
      return field.comparator === '*' ? '*' : filter.value.name + ' ' + filter.value.number
    case 'term':
      return field.comparator === '*' ? '*' : field.comparator + ' ' + filter.value.year + ' ' + filter.value.quarter
  }
}

export default React.memo((props) => {

  const { ax, authCB, professor } = props
  const classes = useStyles()

  const [filterData, setFilterData] = React.useState([])
  const loadFilters = async () => {
    const res = await ax.post('/get-test-visibility-filters')
    console.log(res)
    setFilterData(res.data)
  }

  const [field, setField] = React.useState([])
  const handleChangeField = () => {}

  const addFilter = async () => {}
  const removeFilter = async (filter_id) => {}

  const [dialogOpen, setDialogOpen] = React.useState(false)

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
              <TableCell padding='none'></TableCell>
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
                  <TableCell></TableCell>
                  <TableCell>{displayFilterData(filter.test_id, 'test_id')}</TableCell>
                  <TableCell>{displayFilterData(filter.test_id, 'course')}</TableCell>
                  <TableCell>{displayFilterData(filter.test_id, 'kind')}</TableCell>
                  <TableCell>{displayFilterData(filter.test_id, 'term')}</TableCell>
                  <TableCell>
                    <IconButton onClick={removeFilter(filter._id)}>
                      <RemoveIcon style={{ fontSize: '18px' }} />
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
                  // variant='contained'
                  // color='secondary'
                  // className={classes.button}
                  startIcon={<AddIcon />}
                  fullWidth={true}
                >
                  Add Filter
                </Button>
              </TableCell>
              <AddVisibilityFilterDialog ax={ax} open={dialogOpen} handleClose={() => setDialogOpen(false)} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
})

// 
//               <TableCell>
//                 <FormControl className={classes.formControl}>
//                   <InputLabel id='field-select-label'>Field</InputLabel>
//                   <Select
//                     labelId='field-select-label'
//                     id='field-select'
//                     value={field}
//                     onChange={handleChangeField}
//                   >
//                     <MenuItem value='_id'>Test ID</MenuItem>
//                     <MenuItem value='course'>Course</MenuItem>
//                     <MenuItem value='kind'>Kind</MenuItem>
//                     <MenuItem value='term'>Term</MenuItem>
//                   </Select>
//                 </FormControl>
//               </TableCell>