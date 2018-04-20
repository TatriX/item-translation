import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import cookie from 'react-cookies'

class Preview extends React.Component {
	
	render() {
		return (
		<Link to="/table">
	 <ul id="previewList" onClick={(e)=>localStorage.setItem("tableLanguage",e.target.id)}> 
	 <li id="Russian">Русский</li>
	 <li id="Brazilian Portuguese">Português</li>
	 <li id="Chinese simplified">中文簡體</li>
	 <li id="Chinese traditional">中國傳統</li>
	 <li id="Japanese">日本語</li>
	 <li id="Korean">한국어</li>
	 </ul>
	 </Link>
	  )
	}
 
}

class SignUp extends React.Component {
		constructor(props) {
            super(props);
            this.state = {
              password: '', login : '',secret:'', error: ''
            }; 
		}
		handleLogin (e) {  
			console.log('asdf');
           cookie.save('auth', e.auth);
			window.location.href = '/';
			}
			handleSearchInput(e){  
		  this.setState({
               [e.target.name] : e.target.value.replace(/[^A-Za-z0-9]/g,'')
            }) 
            
			}
	render() {
		const json = {'login': this.state.login,'password': this.state.password,'secret':this.state.secret}
		return (
		<div>
	<form>
  Login:<br/>
  <input type="text" value={this.state.login}  onChange={this.handleSearchInput.bind(this)} name="login"/><br/>
  Password:<br/>
  <input type="text" value={this.state.password}  onChange={this.handleSearchInput.bind(this)} name="password"/>
  <br/>
  Secret passphrase:  <br/>
  <input type="text" value={this.state.secret}  onChange={this.handleSearchInput.bind(this)} name="secret" placeholder="For resetting password"/>
  <br/>
   
</form>
<div  id="login">  <button onClick={() =>this.state.login.length < 5 ? this.setState({login:'',error:'Login is too short'}) : this.state.password.length < 5 ? this.setState({password:'',error:'Password is too short'}) : this.state.secret.length < 5 ?  this.setState({secret:'',error:'Secret passphrase is too short'})  : fetch('/signup', { credentials: 'include',method:'POST',
    headers: { 'content-type': 'application/json'},body:  JSON.stringify(json)}).then(e=>e.json()).then(e=>e.auth.length !== 228 ? this.setState({error:e.auth}) : this.handleLogin(e) )}id="loginButton">Sing up</button>   </div>
	{this.state.error ? <div>{this.state.error}</div> : null} 
</div>
);}
	}

class Auth extends React.Component {
		constructor(props) {
            super(props);
            this.state = {
              password: '', login : '',secret:'',error: '',reset: false
            }; 
		}
		handleLogin (e) {  
           cookie.save('auth', e.auth);
			window.location.href = '/';
			}
		handleSearchInput(e){  
			  this.setState({
           [e.target.name] : e.target.value.replace(/[^A-Za-z0-9]/g,'')
            }) 
            
			}
	render() {
		const link = this.state.reset ? '/reset' : '/login';
		const json = {'login': this.state.login,'password': this.state.password,'secret':this.state.secret}
		return (
		<div>
	<form>
  Login:<br/>
  <input type="text" value={this.state.login} onChange={this.handleSearchInput.bind(this)} name="login"/><br/>
  {this.state.reset ? 'Secret passphrase:' : 'Password:' }<br/>
  {this.state.reset ? 
  <input type="text" value={this.state.secret}  onChange={this.handleSearchInput.bind(this)}  name="secret"/>
  : <input type="password" value={this.state.password}  onChange={this.handleSearchInput.bind(this)}  name="password"/>}
  <br/> 
  Reset password?<input type="checkbox" onClick={()=>this.setState({reset: !this.state.reset})}/><br/>
</form><br/>
 <div> {this.state.error ? this.state.reset ?'Password: '+this.state.error  :  'Error: '  : null} </div>
<div  id="login">   <button onClick={() =>fetch(link, { credentials: 'include',method:'POST',
    headers: { 'content-type': 'application/json'},body:  JSON.stringify(json)}).then(e=>e.json()).then(e=>e.auth.length !== 228 ? this.setState({error:e.auth}) : this.handleLogin(e) )}id="loginButton">{this.state.reset ? 'Reset' : 'Login'}</button>  </div>
  
</div>
);}
	}


class Form extends React.Component {
	render() {
		return ( 
		<div id="form">
		<div id="centredForm">
		<div id="moveForm">
		 {this.props.auth ?<Auth/>: <SignUp/>}
</div>
</div>
</div>
);}}



class RegAuthHeader extends React.Component {
	constructor(props) {
            super(props);
            this.state = {
              auth: true, reg : false
            }; 
		}
		
		clickHandler(e) {
			if (!this.state[e.target.id]) { 
			this.setState({auth: !this.state.auth, reg: !this.state.reg}); }
			}
	render() {
		return ( 
     <div id="authContainer"> 	
	 <div onClick={this.clickHandler.bind(this)} id="reg" className={this.state.reg ?   "regauth activeHeader" : "regauth"}>Sign up</div>	 
	 <div onClick={this.clickHandler.bind(this)} id="auth" className={this.state.auth ?   "regauth activeHeader" : "regauth"}>Login</div>
	<Form auth={this.state.auth}/>
	</div> 
	);}}

class Xxx extends React.Component {
	
	render() {
		return (
	  <Router> 
		<div>
      <Route exact path="/" component={Preview} /> 
      <Route path="/table" component={App} /> 
      <Route path="/regAuth" component={RegAuthHeader} /> 
 
  </div>
  </Router> 
  
  )
	}


}
ReactDOM.render(<Xxx />, document.getElementById('root'));
registerServiceWorker();
