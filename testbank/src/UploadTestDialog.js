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

const WhiteButton = withStyles({
  root: {
    color: '#fff',
    borderColor: '#fff',
  },
})(Button)

const useStyles = makeStyles(theme => ({
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
      <Grid container item xs={9}>
        {props.content}
      </Grid>
    </>
  )
}

export default React.memo((props) => {
  const { ax } = props
  const classes = useStyles()

  const ref = React.useRef(null) // ref is needed for file upload
  const [courseSubject, setCourseSubject] = React.useState()
  const [courseNumber, setCourseNumber] = React.useState()
  const [kindName, setKindName] = React.useState()
  const [kindNumber, setKindNumber] = React.useState()
  const [termYear, setTermYear] = React.useState()
  const [termQuarter, setTermQuarter] = React.useState()
  const [professorName, setProfessorName] = React.useState()

  const uploadFile = async () => {
    let formData = new FormData()
    formData.append('testFile', ref.current.files[0])
    formData.append('courseSubject', courseSubject)
    formData.append('courseNumber', courseNumber)
    formData.append('kindName', kindName)
    formData.append('kindNumber', kindNumber)
    formData.append('termYear', termYear)
    formData.append('termQuarter', termQuarter)
    formData.append('professorName', professorName)
    const res = await ax.post('/upload-test-file', 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }}
    )
    navigate('/test/' + res.data.test_id)
  }  
  const handleSubmit = () => { uploadFile() }

  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => { setOpen(true) }
  const handleClose = () => { setOpen(false) }

  const [uploadButtonName, setUploadButtonName] = React.useState('Select file...')
  return (
    <div>
      <WhiteButton variant='outlined' startIcon={<PublishIcon />} onClick={handleClickOpen}>
        Upload
      </WhiteButton>
      <Dialog onClose={handleClose} aria-labelledby='dialog-title' open={open}>
        <DialogTitle id='dialog-title'>Upload Test</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className={classes.grid}>
            <Row title='File' content={
              <>
                <input
                  accept='application/pdf,image/jpeg,image/png'
                  className={classes.input}
                  id='file-upload-input'
                  type='file'
                  ref={ref}
                  onChange={() => setUploadButtonName(ref.current.files[0].name)}
                />
                <label htmlFor='file-upload-input'>
                  <Button component='span' variant='contained' size='small'>
                    {uploadButtonName}
                  </Button>
                </label>
              </>
            } />
            <Row title='Course' content={
              <>
                <Grid item xs={6}>
                  <TextField
                    id='course-subject'
                    label='Subject'
                    placeholder='MATH'
                    onChange={event => { setCourseSubject(event.target.value) }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id='course-number'
                    label='Number'
                    placeholder='31A'
                    onChange={event => { setCourseNumber(event.target.value) }}
                  />
                </Grid>
              </>
            } />
            <Row title='Kind' content={
              <>
                <Grid item xs={6}>
                  <TextField
                    id='kind-name'
                    label='Name'
                    placeholder='Midterm'
                    onChange={event => { setKindName(event.target.value) }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id='kind-number'
                    label='Number'
                    placeholder='2'
                    onChange={event => { setKindNumber(event.target.value) }}
                  />
                </Grid>
              </>
            } />
            <Row title='Term' content={
              <>
                <Grid item xs={6}>
                  <TextField
                    id='term-year'
                    label='Year'
                    placeholder='2020'
                    onChange={event => { setTermYear(event.target.value) }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id='term-quarter'
                    label='Quarter'
                    placeholder='Fall'
                    onChange={event => { setTermQuarter(event.target.value) }}
                  />
                </Grid>
              </>
            } />
            <Row title='Professor' content={
              <TextField
                id='professor-name'
                label='Name'
                placeholder='Terence Tao'
                onChange={event => { setProfessorName(event.target.value) }}
                fullWidth
              />
            } />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color='primary'>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

