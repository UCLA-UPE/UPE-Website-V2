import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import InboxIcon from '@material-ui/icons/Inbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import GetAppIcon from '@material-ui/icons/GetApp'


function ListItemLink(props) {
  return <ListItem button component="a" {...props} />
}

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    padding: 6,
    '&:last-child': {
      paddingBottom: 6,
    },
  },
  cardContent: {
    padding: 8,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

// {props.kind} {props.professor} {props.term}

export default function TestListItem(props) {

  const classes = useStyles()

  return (
    <ListItem>
      <ListItemText
        primary={props.kind}
        secondary={props.professor + ' - ' + props.term}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="download">
          <GetAppIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
