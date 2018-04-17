import React, {
    Component
}
from 'react'; 
 
import './App.css';
 
 class Settings extends React.Component {
  
		
		render() {
			return (

	<div id="settingsContainer">

<select onChange={this.props.setListLength} value={this.props.listLengthValue}> 
  <option value="10">10</option>
  <option value="25">25</option>
  <option value="50">50</option>
  <option value="1969">1969</option>
</select>
<select onChange={this.props.setImportLanguage} value={this.props.importLanguageValue}>  
  <option value="Russian" >Russian</option>
  <option value="Brazilian Portuguese">Brazilian Portuguese</option>
  <option value="Japanese">Japanese</option>
  <option value="Korean">Korean</option>
  <option value="Chinese traditional">Chinese traditional</option>
  <option value="Chinese simplified">Chinese simplified</option>
</select>
<Json importLanguage={this.props.importLanguage}/>
<br/>
<a target="_blank" rel="noopener noreferrer" href={"http://localhost:3001/download/"+this.props.langValue} download="dist.json">скачать </a>
<br/>
<button onClick={() => fetch('/import/Sync',{  method: "POST",  headers: { 'content-type': 'application/json'}})}>Sync</button>
</div>
			)
			}
	 
	 }
 
 
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
            fetch('/translation/' + this.props.item + '/' + this.state.ru.trim() + '/' + this.props.tableLang, {
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
             this.state =  {multilangHeaders : {"Russian": {"translationVariants":"Варианты перевода","noVariants":"Не переведено"},"Brazilian Portuguese": {"translationVariants":"Opções de tradução","noVariants":"Não traduzido"},"Chinese traditional":{"translationVariants":"翻譯選項","noVariants":"未翻譯"},"Chinese simplified":{"translationVariants":"翻译选项","noVariants":"未翻译"},"Japanese":{"translationVariants":"翻訳オプション","noVariants":"翻訳されていない"},"Korean":{"translationVariants":"번역 옵션","noVariants":"번역되지 않음"}}, importLanguage: "Russian",items: [], active : '',variants: [],counts:[],listLength : localStorage.getItem("listLength") || 10, tableLang:localStorage.getItem("tableLanguage") || 'Russian', noTranslationOnly: true};   
        
        
 
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
            }).then(res=>res.json()).then((json)=> {if (json.length === 0) {this.setState({variants:this.state.multilangHeaders[localStorage.getItem("tableLanguage")].noVariants,counts:[]},()=>console.log(json))}  else {this.setState({counts: json.map(e=>e.count),variants: json.map(e=>e.variant)},()=>console.log("x",json))} } );
	  }

fetchList() {
	 fetch('/users/'+this.state.listLength + '/'+ this.state.tableLang + '/' + this.state.noTranslationOnly)
      .then(res => res.json())
      .then((items) => {this.setState({ items: items }); return items}).then(x=>this.makeActive(x[0].nameEng));
	}

setListLength (event) {
	localStorage.setItem("listLength",event.target.value);
	this.setState({listLength: localStorage.getItem("listLength")},() => {this.fetchList();}); 
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
    <th> </th>
    <th> </th> 
    <th> </th> 
    {this.state.active ? <th>{this.state.multilangHeaders[localStorage.getItem("tableLanguage")].translationVariants}</th> : null}
     <th id="settings"> <div id="settingsIcon">⚙</div> </th> 
  </tr>
      </thead>
   <tbody>
       {this.state.items.map((a,index)  => <Row tableLang={this.state.tableLang} updateVariants={this.fetchVariants.bind(this)}  active={this.state.active} key={index} item={a.nameEng} makeActive={this.makeActive.bind(this)}  extraVariant={this.state.variants.length <1 ? null :this.state.variants[index]} count={this.state.counts.length <1? null : this.state.counts[index]}/>)} 
        
        </tbody>
</table> 


	   <Settings importLanguage={this.state.importLanguage} setListLength={this.setListLength.bind(this)} setImportLanguage={this.setImportLanguage.bind(this)} listLengthValue={this.state.listLength} langValue={this.state.importLanguage} /> 
  
  
      </div>
    );
  }
}

export default App;
