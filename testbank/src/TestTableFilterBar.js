import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

const termQuarterCompare = (a, b) => {
  if (a.quarter === b.quarter) return 0
  else if (a.quarter === 'Fall') return -1
  else if (b.quarter === 'Fall') return 1
  else if (a.quarter === 'Winter') return -1
  else if (b.quarter === 'Winter') return 1
  else if (a.quarter === 'Spring') return -1
  else if (b.quarter === 'Spring') return 1
  else if (a.quarter === 'Summer') return -1
  else if (b.quarter === 'Summer') return 1
  else return a.quarter.localeCompare(b.quarter)
}

const termCompare = (a, b) => {
  if (a.year !== b.year) return a.year - b.year
  else return termQuarterCompare(a, b)
}

const kindCompare = (a, b) => {
  if (a.name === b.name) { return a.number - b.number }
  else if (a.name === 'Quiz') { return -1 }
  else if (b.name === 'Quiz') { return 1 }
  else if (a.name === 'Midterm') { return -1 }
  else if (b.name === 'Midterm') { return 1 }
  else if (a.name === 'Final') { return -1 }
  else if (b.name === 'Final') { return 1  }
  else { return a.name.localeCompare(b.name) }
}

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
      '/get-filter-options', { preFilters: preFilters, getHidden: getHidden }
    )

    let filterOptionsSorted = []

    if (res.data.professor) {
      filterOptionsSorted.push(...res.data.professor.map( professor => ({
        field: 'professor', 
        fieldDisplay: 'Professor', 
        data: professor, 
        display: professor.name ? professor.name : '(None)', 
      })).sort( (a, b) => (a.display === null ? -1 : a.display.localeCompare(b.display))))
    }

    if (res.data.course) {
      filterOptionsSorted.push(...res.data.course.map( course => ({
        field: 'course', 
        fieldDisplay: 'Course', 
        data: course, 
        display: course.subject + ' ' + course.number, 
      })).sort())
    }

    if (res.data.kind) {
      filterOptionsSorted.push(...res.data.kind.map( kind => ({
        field: 'kind', 
        fieldDisplay: 'Kind', 
        data: kind, 
        display: kind.name + ' ' + (kind.number ? kind.number : '')
      })).sort((a, b) => kindCompare(a.data, b.data)))
    }

    if (res.data.term) {
      filterOptionsSorted.push(...res.data.term.map( term => ({
        field: 'term', 
        fieldDisplay: 'Term', 
        data: term, 
        display: term.year.toString() + ' ' + term.quarter,
      })).sort((a, b) => termCompare(a.data, b.data)))
    }

    console.log(filterOptionsSorted)
    setFilterOptions(filterOptionsSorted)
  }

  const handleClickFilterBar = () => {
    if (filterOptions.length === 0 && authCB.isLoggedIn()) {
      loadFilterOptions()
    }
  }

  return (
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