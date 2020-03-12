import React from 'react'
import { aggregateFilters } from './util'

import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(theme => ({
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

  const { ax, authCB, preFilters, handleFilterItemsChange } = props
  const getHidden = props.getHidden || false
  const classes = useStyles()

  const [filterOptions, setFilterOptions] = React.useState([])
  const loadFilterOptions = async () => {
    const res = await ax.post(
      '/get-filter-options', { preFilters: aggregateFilters(preFilters), getHidden: getHidden }
    )

    let filterOptionsArr = []

    const fields = ['Professor', 'Course', 'Kind', 'Term']
    fields.map(field => {
      if (!res.data[field.toLowerCase()]) return
      filterOptionsArr.push(...res.data[field.toLowerCase()].map( option => ({
        field: field,
        data: option,
        display: (() => { switch (field) {
          case 'Professor':
            return (option.name ? option.name : '(None)')
          case 'Course':
            return (option.subject + ' ' + option.number)
          case 'Kind':
            return (option.name + ' ' + (option.number ? option.number : ''))
          case 'Term':
            return (option.year.toString() + ' ' + option.quarter)
        }})()
      })))
    })

    setFilterOptions(filterOptionsArr)
  }

  const handleClickFilterBar = () => {
    if (filterOptions.length === 0 && authCB.isLoggedIn()) {
      loadFilterOptions()
    }
  }

  return (
    <Toolbar className={classes.filterControlsToolbar}>
      <Autocomplete
        autoComplete
        multiple
        filterSelectedOptions
        id='grouped-filter'
        className={classes.filterAutocomplete}
        options={filterOptions}
        groupBy={option => option.field}
        getOptionLabel={option => option.display}
        onChange={handleFilterItemsChange}
        renderInput={params => (
          <TextField 
            {...params} 
            onClick={handleClickFilterBar}
            label='Filter / Search' 
            variant='outlined' 
            fullWidth 
          />
        )}
        ChipProps={{ color: 'primary' }}
      />
    </Toolbar>
  )
})