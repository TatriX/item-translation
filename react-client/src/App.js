import React, {
    Component
}
from 'react'; 

import './App.css';
 
class Json extends React.Component {
 constructor(props) {
            super(props);
            this.state = {
               importJson:'Импортировать JSON',isCorrectJson: 'default',json: ''
            };
         this.handleSetState = this.handleSetState.bind(this); 
		}
     
     
     importFile() { 
		 console.log(typeof this.state.json);
		 fetch('/import/' + this.props.importLanguage,
{
    method: "POST",
    body: this.state.json,
    headers: { 'content-type': 'application/json'}
})
		 }
		 
     handleSetState(action,fileName,JSON) {
	 	 let setState = (e) => this.setState(e);
		 switch (action) {
			 case 'ready': 
         setState({importJson:   fileName +"\u2713" ,isCorrectJson: 'ready',json: JSON });
         break;
			 case 'error':  
         setState({importJson:   fileName +"\u2716" ,isCorrectJson: 'error',json: '' });
         break;
         default: 
		 setState({importJson: 'Импортировать JSON',isCorrectJson: 'default',json: ''}); 
         break;
			 }
		 }
     
            importJson(event) {  
	 let handleSetState = this.handleSetState;
	 if (event.target.files.length < 1) {
		handleSetState();
		 return;
		 }  
		 
	 let fileName = event.target.files[0].name.replace('.json','');
	 
	 
	 
	  
	  const   validateJson = (string) =>  {
    try {
        JSON.parse(string);
    } catch (e) { 
        return false;
    } 
    return true;
}


	 var reader = new FileReader();
	 reader.onload =(function(theFile) { 
        return function(e) {   
			if (validateJson(e.target.result)){ 
				handleSetState('ready',fileName,e.target.result);
	  } else { 
		  handleSetState('error',fileName); 
		  }
        };
      })(event.target.files[0]);
      
       reader.readAsText(event.target.files[0]);
       
	 }
	 
	 
	 
             render() { 
				 
     return       <div id="JSON"> <label id='importJsonId'  className={this.state.isCorrectJson} htmlFor="importJson">
     {this.state.importJson}
        <input type='file' onChange={this.importJson.bind(this)} accept='.json' id="importJson" />
        </label> 
        <label id='submitJsonId'  className={this.state.isCorrectJson === 'ready' ? 'submitActive' : 'submitUnactive' } htmlFor="submitJson" onClick={this.state.json ? this.importFile.bind(this) : null}> 
        Submit
           </label> 
        <input type='submit' id="submitJson" />
        
        </div>
		} //render
	}






class Row extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                ru: '' 
            };
        } 
        change = (e) => {  
            this.setState({
                ru: e.target.value 
            }) 
        }
        reset = () => this.setState({
            ru: ''
        })
        submit = () => {
            fetch('/translation/' + this.props.item + '/' + this.state.ru + '/' + this.props.tableLang, {
                method: 'POST'
            }).then(() => this.props.makeActive(this.props.item)) 
        } 
        submitVariant = () => {
			 fetch('/translation/' + this.props.active + '/' + this.props.extraVariant+ '/' + this.props.tableLang, {
                method: 'POST'
            }).then(()=> this.props.updateVariants(this.props.active))
			}
        render() { 
                return <tr className={this.props.active === this.props.item ? 'active' : null}>
                    < td   onClick={() => this.props.makeActive(this.props.item)} > {
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
             this.state = {importLanguage: "Russian",items: [], active : '',variants: [],counts:[],listLength : localStorage.getItem("listLength") || 10, tableLang:localStorage.getItem("tableLanguage") || 'Russian'};   
           this.setListLength = this.setListLength.bind(this);
        } 
 

  componentDidMount() {
   this.fetchList();
  }
  
 makeActive(someItem) { 
    this.setState({ active: someItem },()=>this.fetchVariants(this.state.active));   
  }
  fetchVariants(parent) {
	  fetch('/variants/'+parent + '/'+ this.state.tableLang, {
                method: 'POST'
            }).then(res=>res.json()).then((json)=> {if (json.length === 0) {this.setState({variants:["Не переведено"],counts:[]})}  else {this.setState({counts: json.map(e=>e.count),variants: json.map(e=>e.variant)})} } );
	  }

fetchList() {
	 fetch('/users/'+this.state.listLength + '/'+ this.state.tableLang)
      .then(res => res.json())
      .then((items) => {this.setState({ items: items }); return items}).then(x=>this.makeActive(x[0].nameEng));
	}

setListLength (event) {
	localStorage.setItem("listLength",event.target.value);
	this.setState({listLength: localStorage.getItem("listLength")},() => this.fetchList()); 
	}
 setImportLanguage (event) {  
	this.setState({importLanguage: event.target.value}); 
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
     <th id="settings"> <div id="settingsIcon">⚙</div> </th> 
  </tr>
      </thead>
   <tbody>
       {this.state.items.map((a,index)  => <Row tableLang={this.state.tableLang} updateVariants={this.fetchVariants.bind(this)}  active={this.state.active} key={index} item={a.nameEng} makeActive={this.makeActive.bind(this)}  extraVariant={this.state.variants.length <1 ? null :this.state.variants[index]} count={this.state.counts.length <1? null : this.state.counts[index]}/>)} 
        
        </tbody>
</table> 
<Json importLanguage={this.state.importLanguage}/>
<br/>
<a target="_blank" rel="noopener noreferrer" href="http://localhost:3001/download" download="dist.json">скачать </a>
<br/>
<select onChange={this.setListLength} value={this.state.listLength}> 
  <option value="10">10</option>
  <option value="25">25</option>
  <option value="50">50</option>
  <option value="1969">1969</option>
</select>
<select onChange={this.setImportLanguage.bind(this)} value={this.state.importLanguage}>  
  <option value="Russian" >Russian</option>
  <option value="Brazilian Portuguese">Brazilian Portuguese</option>
  <option value="Japanese">Japanese</option>
  <option value="Korean">Korean</option>
  <option value="Chinese traditional">Chinese traditional</option>
  <option value="Chinese simplified">Chinese simplified</option>
</select>
<button onClick={() => fetch('/import/Sync',{  method: "POST",  headers: { 'content-type': 'application/json'}})}>Sync</button>
      </div>
    );
  }
}

export default App;
