import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import './App.css'

const apiUrl = `http://localhost:8080`

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  async createUser() {
    await axios.get(apiUrl + '/user-create')
    this.loadUsers()
  }
  
  async loadUsers() {
    const res = await axios.get(apiUrl + '/users')
    this.setState({
      users: res.data
    })
  }

  componentDidMount() {
    this.loadUsers()
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Button variant="contained" color="primary">
            Hello World
          </Button>
          <button onClick={() => this.createUser()}>Create User</button>
          <p>Users liast:</p>
          <ul>
            {this.state.users.map(user => (
              <li key={user._id}>id: {user._id}</li>
            ))}
          </ul>
        </header>
      </div>
    )
  }
}

export default App
