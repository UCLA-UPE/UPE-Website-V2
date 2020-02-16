import React from 'react'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { navigate } from 'hookrouter'

export default function Home(props) {

  const { ax, authCB } = props

  React.useEffect(() => {
    if (authCB.isLoggedIn()) {
      navigate('/testbank/peruse')
    } else {
      loadCount()
    }
  }, [])

  const [count, setCount] = React.useState()
  const loadCount = async (opts) => {
    try {
      const res = await ax.get('/summary')
      setCount(res.data)
    } catch(e) {
      console.log('Home.js')
      console.log(e)
    }
  }

  return (
    <Box mt={8}>
      <Typography variant='h2' component='h1' align='center'>
        UCLA UPE Testbank
      </Typography>
      <Typography variant='h3' component='h2' align='center'>
        We have {count} tests.
      </Typography>
    </Box>
  )
}