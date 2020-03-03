import React from 'react'
import { navigate } from 'hookrouter'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import PublishIcon from '@material-ui/icons/Publish'
import Grid from '@material-ui/core/Grid'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 80,
  },
  input: {
    display: 'none'
  },
  grid: {
    padding: theme.spacing(4),
    alignItems: 'center'
  },
  leftCol: {
    width: '100%',
    paddingRight: theme.spacing(1),
    textAlign: 'right'
  },
  rightCol: {
    width: '100%',
  }
}))

const Row = (props) => {
  const classes = useStyles()
  return (
    <>
      <Grid container item xs={3}>
        <Typography className={classes.leftCol} component='div'>
          <Box fontWeight='fontWeightMedium'>
            {props.title}
          </Box>
        </Typography>
      </Grid>
      <Grid container item xs={3}>
        <FormControl fullWidth>
          <InputLabel id={'select-label-' + props.title}>Comparator</InputLabel>
          <Select
            labelId={'select-label-' + props.title}
            id={'select-' + props.title}
            onChange={event => props.handleCmpChange(event.target.value)}
            value={props.cmpValue}
          >
            {props.cmpMenuItems.map(item => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid container item xs={6}>
        {props.valueFormFields.map(item => (
          <Grid key={item.label} item xs={12 / props.valueFormFields.length}>
            <TextField
              id={props.title + '-' + item.label + '-filter'}
              label={item.label}
              onChange={event => { item.onChange(event.target.value) }}
              disabled={props.cmpValue === '*' ? true : false}
            />
          </Grid>  
        ))}
      </Grid>
    </>
  )
}

export default React.memo((props) => {
  const { ax, open, handleClose } = props
  const classes = useStyles()


  const [testIdCmp,     setTestIdCmp] =     React.useState('*')
  const [testId,        setTestId] =        React.useState(null)
  const [courseCmp,     setCourseCmp] =     React.useState('*')
  const [courseSubject, setCourseSubject] = React.useState(null)
  const [courseNumber,  setCourseNumber] =  React.useState(null)
  const [kindCmp,       setKindCmp] =       React.useState('*')
  const [kindName,      setKindName] =      React.useState(null)
  const [kindNumber,    setKindNumber] =    React.useState(null)
  const [termCmp,       setTermCmp] =       React.useState('*')
  const [termYear,      setTermYear] =      React.useState(null)
  const [termQuarter,   setTermQuarter] =   React.useState(null)

  const appendFilter = async () => {
    const res = await ax.post('/append-test-visibility-filters', {
      visibilityFilter: {
        test_id: {
          comparator: testIdCmp,
          value: testId
        },
        course: {
          comparator: courseCmp,
          value: { subject: courseSubject, number: courseNumber }
        },
        kind: {
          comparator: kindCmp,
          value: { name: kindName, number: kindNumber }
        },
        term: {
          comparator: termCmp,
          value: { year: termYear, quarter: termQuarter }
        }
      }
    })
  }

  const [uploadButtonName, setUploadButtonName] = React.useState('Select file...')
  return (
    <Dialog onClose={handleClose} aria-labelledby='dialog-title' open={open} fullWidth>
      <DialogTitle id='dialog-title'>Add Visibility Filter</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} className={classes.grid}>
          <Row
            title='Test ID' 
            cmpMenuItems={['*', '==']} 
            cmpValue={testIdCmp} 
            handleCmpChange={setTestIdCmp} 
            valueFormFields={[
              { label: 'Test ID Number', onChange: setTestId }, 
            ]}
          />
          <Row
            title='Course' 
            cmpMenuItems={['*', '==']} 
            cmpValue={courseCmp} 
            handleCmpChange={setCourseCmp} 
            valueFormFields={[
              { label: 'Subject', onChange: setCourseSubject }, 
              { label: 'Number', onChange: setCourseNumber }, 
            ]}
          />
          <Row
            title='Kind' 
            cmpMenuItems={['*', '==']} 
            cmpValue={kindCmp} 
            handleCmpChange={setKindCmp} 
            valueFormFields={[
              { label: 'Name', onChange: setKindName }, 
              { label: 'Number', onChange: setKindNumber }, 
            ]}
          />
          <Row
            title='Term' 
            cmpMenuItems={['*', '==', '<=', '>=']} 
            cmpValue={termCmp} 
            handleCmpChange={setTermCmp} 
            valueFormFields={[
              { label: 'Year', onChange: setTermYear }, 
              { label: 'Quarter', onChange: setTermQuarter }, 
            ]}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={appendFilter} color='primary'>
          Add Filter
        </Button>
      </DialogActions>
    </Dialog>
  )
})

