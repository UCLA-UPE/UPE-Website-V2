import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import TestTable from './TestTable'

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
          <Box fontWeight='fontWeightMedium'>
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

const ProfessorRowContent = (props) => {
  if (!props.professor) return 'No'
  else return (
    <>
      You are verified as <span style={{ color: 'fuchsia' }}>{props.professor.name}</span>. Your tests:
      <Box mt={3}>
        <TestTable 
          ax={props.ax} 
          authCB={props.authCB} 
          handleClickTestInfo={props.handleClickTestInfo} 
          preFilters={{ professor: [{ name: props.professor.name }] }} 
          getHidden={true}
        />
      </Box>
    </>
  )
}

export default React.memo((props) => {
  
  const { ax, authCB, handleClickTestInfo } = props
  const classes = useStyles()

  // is there a better way?
  const [email, setEmail] = React.useState()
  const [isUpeMember, setIsUpeMember] = React.useState()
  const [professor, setProfessor] = React.useState()
  const [testbankCredits, setTestbankCredits] = React.useState()
  const [testbankUploadedTests, setTestbankUploadedTests] = React.useState()

  const loadProfile = async () => {
    const res = await ax.post('/get-profile')
    setEmail(res.data.email)
    setIsUpeMember(res.data.isUpeMember)
    setProfessor(res.data.professor)
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
      <Typography variant='h2' component='h2'>
        Profile
      </Typography>
      <Grid container spacing={2} className={classes.grid}>
        <Row title='Email' content={email} />
        <Row title='Password' content='[encrypted]' />
        <Row title='UPE Status' content={isUpeMember ? 'Yes' : 'No'} />
        <Row 
          title='Professor Status' 
          content={<ProfessorRowContent 
            ax={ax} 
            authCB={authCB} 
            handleClickTestInfo={handleClickTestInfo}
            professor={professor}
          />} 
        />
        <Row title={<span>&nbsp;</span>} content='' />
        <Row title='Download Credits' content={testbankCredits} />
        <Row title='Uploaded Tests' content={testbankUploadedTests} />
      </Grid>
    </>
  )
})
