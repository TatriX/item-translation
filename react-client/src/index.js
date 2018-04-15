import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


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


class Xxx extends React.Component {
	
	render() {
		return (
	  <Router> 
		<div>
      <Route exact path="/" component={Preview} /> 
      <Route path="/table" component={App} /> 
 
  </div>
  </Router> 
  
  )
	}


}
ReactDOM.render(<Xxx />, document.getElementById('root'));
registerServiceWorker();
