import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles(theme => ({
  grid: {
    padding: theme.spacing(4)
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
          <Box fontWeight="fontWeightMedium">
            {props.title}
          </Box>
        </Typography>
      </Grid>
      <Grid container item xs={9}>
        <Typography className={classes.rightCol} component='div'>
          <Box>
            {props.content}
          </Box>
        </Typography>
      </Grid>
    </>
  )
}

export default React.memo((props) => {
  
  const { ax, authCB } = props
  const classes = useStyles()

  // is there a better way?
  const [email, setEmail] = React.useState()
  const [isUpeMember, setIsUpeMember] = React.useState()
  const [isProfessor, setIsProfessor] = React.useState()
  const [testbankCredits, setTestbankCredits] = React.useState()
  const [testbankUploadedTests, setTestbankUploadedTests] = React.useState()

  const loadProfile = async () => {
    const res = await ax.post('/get-profile')
    setEmail(res.data.email)
    setIsUpeMember(res.data.isUpeMember)
    setIsProfessor(res.data.isProfessor)
    setTestbankCredits(res.data.testbankCredits)
    setTestbankUploadedTests(res.data.testbankUploadedTests)
  }

  React.useEffect(() => {
    if (authCB.isLoggedIn()) {
      loadProfile()
    }
  }, [])

  return (
    <>
      <Typography variant="h2" component="h2">
        Profile
      </Typography>
      <Grid container spacing={2} className={classes.grid}>
        <Row title='Email' content={email} />
        <Row title='Password' content='[encrypted]' />
        <Row title='UPE Status' content={isUpeMember ? 'Yes' : 'No'} />
        <Row title='Professor Status' content={isProfessor ? 'Yes' : 'No'} />
        <Row title={<span>&nbsp;</span>} content='' />
        <Row title='Download Credits' content={testbankCredits} />
        <Row title='Uploaded Tests' content={testbankUploadedTests} />
      </Grid>
    </>
  )
})
