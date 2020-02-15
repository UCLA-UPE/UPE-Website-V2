import React from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { navigate } from 'hookrouter'

export default function Home(props) {
  React.useEffect(() => {
    if (props.token) {
      navigate('/testbank/peruse')
    }
  })

  return (
    <Box mt={8}>
      <Typography variant='h1' align='center'>
        UCLA UPE Testbank
      </Typography>
    </Box>
  )
}