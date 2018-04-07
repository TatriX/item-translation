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
        submitVariant = () => {
			 fetch('/translation/' + this.props.item + '/' + this.props.extraVariant, {
                method: 'POST'
            }).then(()=> this.props.updateVariants(this.props.item))
			}
        render() {
			 var makeActive = this.props.makeActive;
                return <tr className={this.props.isActive}>
                    < td   onClick={() => makeActive(this.props.item)} > {
                        this.props.item
                    } < /td>
    <td><input type='text'  onChange={this.change} value={this.state.ru}  /> < /td>
    <td><button onClick={this.reset}  id='resetButton'>Reset</button >
                    < button id='submitButton' onClick = {
                        this.submit
                    } > Submit < /button></td >  
                    {!this.props.extraVariant ?  null :  !this.props.count ?  <td>{this.props.extraVariant}</td> : <td> {this.props.extraVariant} <button className="plusOne"   onClick={this.submitVariant}>{this.props.count}</button></td>} 
                     
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
      .then(items => this.setState({ items: items })).then(()=>this.makeActive(this.state.items[0].nameEng));
  }
  
 makeActive(someItem) { 
    this.setState({ active: someItem },()=>this.fetchVariants(this.state.active));   
  }
  fetchVariants(parent) {
	  fetch('/users/'+parent, {
                method: 'POST'
            }).then(res=>res.json()).then((json)=> {if (json.length === 0) {this.setState({variants:["Не переведено"],counts:[]})} else {this.setState({counts: json.map(e=>e.count),variants: json.map(e=>e.variant)})} } );
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
       {this.state.items.map((a,index)  => <Row  updateVariants={this.fetchVariants.bind(this)} isActive={a.nameEng === this.state.active ? 'active' : null} key={index} item={a.nameEng} makeActive={this.makeActive.bind(this)} extraVariant={this.state.variants.length <1 ? null :this.state.variants[index]} count={this.state.counts.length <1? null : this.state.counts[index]}/>)} 
        </tbody>
</table>
        <a target='_blank'  rel="noopener noreferrer" href='http://localhost:3001/download' download='dist.json'>скачать </a>
      </div>
    );
  }
}

export default App;
