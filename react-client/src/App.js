import React, {
    Component
}
from 'react';
import ReactDOM from 'react-dom';


import './App.css';

 

class Row extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                ru: ''  
            };
        } 
        change = (e) => {  
            this.setState({
                ru: e.target.value.replace(/[^А-Яа-я\s]/g,'') 
            }) 
        }
        reset = () => this.setState({
            ru: ''
        })
        submit = () => {
            fetch('/translation/' + this.props.item + '/' + this.state.ru, {
                method: 'POST'
            }).then(() => this.props.makeActive(this.props.item)) 
        } 
        submitVariant = (e) => {
			 fetch('/translation/' + this.props.item + '/' + e.target.value, {
                method: 'POST'
            }).then(() => this.props.makeActive(this.props.item)) 
			}
        render() {
			 var makeActive = this.props.makeActive;
                return <tr>
                    < td onClick={() => makeActive(this.props.item)} > {
                        this.props.item
                    } < /td>
    <td><input type='text'  onChange={this.change} value={this.state.ru}  /> < /td>
    <td><button onClick={this.reset}  id='resetButton'>Reset</button >
                    < button id='submitButton' onClick = {
                        this.submit
                    } > Submit < /button></td > 
                    {this.props.extraVariant ? <td>{this.props.extraVariant} <button id="plusOne" onClick={(e)=>this.submitVariant}>{this.props.count}</button> </td> : null}
                    < /tr>
  }
}


class App extends Component {
	
	constructor(props) {
            super(props); 
             this.state = {items: [], active : '',variants: [],counts:[]};   
        } 
 

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(items => this.setState({ items: items }));
  }
  
 makeActive(someItem) { 
    this.setState({ active: someItem },()=>this.fetchVariants(this.state.active));  
    console.log(this.state.variants); 
    console.log(this.state.counts);
  }
  fetchVariants(parent) {
	  fetch('/users/'+parent, {
                method: 'POST'
            }).then(res=>res.json()).then(json=> this.setState({counts: json.map(e=>e.count),variants: json.map(e=>e.variant)})  );
	  }
  render() { 
    return (
      <div>
        <h1 id='header'>Зо головок</h1>
        <table id="entireTable">
          <thead>
         <tr>
    <th>Украинский</th>
    <th>Русский</th> 
    <th>Опции</th> 
    {this.state.active ? <th>Варианты перевода</th> : null}
  </tr>
      </thead>
   <tbody>
       {this.state.items.map((a,index)  => <Row key={index} item={a.nameEng} makeActive={this.makeActive.bind(this)} extraVariant={this.state.variants.length <1 ? null :this.state.variants[index]} count={this.state.counts.length <1? null : this.state.counts[index]}/>)} 
        </tbody>
</table>
      </div>
    );
  }
}

export default App;
