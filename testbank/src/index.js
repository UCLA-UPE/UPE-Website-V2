import React from 'react'
import ReactDOM from 'react-dom'
import { setBasepath } from 'hookrouter'
import App from './App.js'

setBasepath('/testbank')
ReactDOM.render(<App />, document.getElementById('root'))
