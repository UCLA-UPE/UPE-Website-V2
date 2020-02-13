import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    minWidth: 100,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 4px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    padding: 16,
    lineHeight: 2,
  },
})

export default function GridCard(props) {
  const classes = useStyles()
  // const bull = <span className={classes.bullet}>•</span>

  const listBulleted = (max_overflow) => {
    let s = props.subItems.slice(0, max_overflow).map((number, i) => (
      <span key={number}>{(i ? <span>&emsp;</span> : '')}{number}</span>
    ))
    if (props.subItems.length > max_overflow) {
      s.push(<span key={max_overflow}>&emsp;({props.subItems.length - max_overflow}&nbsp;more)</span>)
    }
    return s
  }

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Typography variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {listBulleted(8)}
          </Typography>
          <Typography variant="body2" component="p">
            {props.documentCount} Documents
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}