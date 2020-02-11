import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    minWidth: 100,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 3px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

export default function SubjectCard(props) {
  const classes = useStyles()
  const bull = <span className={classes.bullet}>•</span>
  const match = useRouteMatch()

  const listBulleted = (max_overflow) => {
    let s = props.subItems.slice(0, max_overflow).map((number, i) => (
      <span key={number}>{(i ? bull : '')}{number}</span>
    ))
    if (props.subItems.length > max_overflow) {
      s.push(<span key={max_overflow}>{bull}({props.subItems.length - max_overflow} more)</span>)
    }
    return s
  }

  // const test = () => { () }

  return (
    <Card className={classes.root}>
      <Link to={`${match.url}/${props.title}`} onClick={props.handleClick} style={{ textDecoration: 'none' }}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5" component="h2">
              {props.title}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {listBulleted(7)}
            </Typography>
            <Typography variant="body2" component="p">
              {props.documentCount} Tests
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}