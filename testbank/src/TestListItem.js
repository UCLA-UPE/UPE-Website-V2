import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import InboxIcon from '@material-ui/icons/Inbox'
import DraftsIcon from '@material-ui/icons/Drafts'

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}))

export default function TestListItem(props) {

  const classes = useStyles()

  return (
    <ListItem alignItems="flex-start">
      <ListItemText
        primary={props.kind}
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              className={classes.inline}
              color="textPrimary"
            >
              {props.professor}
            </Typography>
            {' '}
            {props.term}
          </React.Fragment>
        }
      />
    </ListItem>
  )
}
