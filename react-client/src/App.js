import React, { Component } from 'react';
import ReactDOM   from 'react-dom';
import './App.css';


class Row extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    ru: ''
  };
}
  
  
  
   change = (e) => {
    this.setState({ru: e.target.value})
  } 
    reset = () => this.setState({ru: ''})
      submit = () => {
		  fetch('/translation/'+ this.props.item +'/'+ this.state.ru
		  ,{ method: 'POST'}
		  )
		  }
  render() {
    return  <tr>
    <td>{this.props.item}</td>
    <td><input type='text'  onChange={this.change} value={this.state.ru}/></td>
    <td><button onClick={this.reset} >Reset</button>
    <button  onClick={this.submit} >Submit</button></td>
    </tr>
  }
}


class App extends Component {
  state = {items: []}

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(items => this.setState({  items }));
  }
  

  render() {
    return (
      <div className="App">
        <h1>Зо головок</h1>
        <table id="customers">
         <tr>
    <th>Украинский</th>
    <th>Русский</th> 
    <th>Опции</th> 
  </tr>
       {this.state.items.map(a => <Row item={a.nameEng}/>)}
</table>
      </div>
    );
  }
}

export default App;
