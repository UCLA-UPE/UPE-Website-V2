import React from 'react'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import MenuIcon from '@material-ui/icons/Menu'
import PublishIcon from '@material-ui/icons/Publish'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

const WhiteButton = withStyles({
  root: {
    color: '#fff',
    borderColor: '#fff',
  },
})(Button)

const useStyles = makeStyles(theme => ({
  input: {
    display: 'none'
  }
}))

export default React.memo((props) => {

  const { ax } = props
  const classes = useStyles()

  const ref = React.useRef()

  const uploadFile = async () => {
    let formData = new FormData()
    formData.append('file', ref.current.files[0])
    const res = await ax.post('/upload-test-file', 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }}
    )
  }

  const handleChange = () => {
    uploadFile()
  }

  return (
    <div>
      <input
        accept="application/pdf,image/jpeg,image/png"
        className={classes.input}
        id="file-upload-input"
        type="file"
        ref={ref}
        onChange={handleChange}
      />
      <label htmlFor="file-upload-input">
        <WhiteButton variant="outlined" component="span" startIcon={<PublishIcon />}>
          Upload
        </WhiteButton>
      </label>
    </div>
  )
})
