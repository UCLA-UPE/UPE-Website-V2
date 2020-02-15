import React from 'react'
import axios from 'axios'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { navigate } from 'hookrouter'

export default function Home(props) {

  const { token, apiUrl } = props

  React.useEffect(() => {
    if (token) {
      navigate('/testbank/peruse')
    } else {
      loadCount()
    }
  }, [])

  const [count, setCount] = React.useState()
  const loadCount = async (opts) => {
    try {
      const res = await axios.get(apiUrl + '/summary')
      setCount(res.data)
    } catch(e) {
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