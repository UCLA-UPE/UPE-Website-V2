import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

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

  const { ax, authCB, course, handleFilterItemsChange } = props
  const classes = useStyles()

  const [filterOptions, setFilterOptions] = React.useState([])
  const loadFilterOptions = async () => {
    const res = await ax.post(
      '/get-filter-options', { course: course }
    )

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