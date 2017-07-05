/*
	E-commerce site version 4.0.0
	-----------------------------
	2009-07-04: added autosave() and related vars
	2008-01-27: added function newOptionSet()

*/
var _FORMS_VERSION_=4.00;
var _FORMS_INSTANCE=1;

var detectChange=0;
var submitting=true;
var userWillTolerate=30; //user waits this long in seconds for form to process
var force=0;
var replID=null
var sfpath='/console/resources/';
var processingImageURL='/images/i/processing1.gif';
var submitFailURL='index_01_exe.php';
var submitFailMessage='';
var sets=new Array();
var ignores=''; //this is a comma-separated string
var overrideFailTimeout=false; //by default the clock begins ticking for failure on a form submission
//---------------- functions -----------------
function dChge(o, f, p){
	if(typeof p!='undefined'){
		f(p);
		return;
	}
	detectChange=1;
}
function mgeChge(o){
	dChge();
}
function beginSubmit(precallfunction, failurecallfunction){
	/*
	version 2.0 modified 2008-02-27 to handle a pre-call and failure-call function.  This function returns false if there are any problems
	NOTE that we try-catch the precallfunction and setting SubmitApplication, etc..  If there is an error, the behavior is to submit the form anyway - the server is ultimately the one that catches errors
	*/
	submitting=true; //set state of form to submitting
	try{
		if(typeof precallfunction !=='undefined'){
			var check=false;
			eval('check='+precallfunction);
			//precallfunction must return true for the form to be submitted
			if(!check){
				submitting=false;				
				return false;
			}
		}else{
			//standard actions
			if(g('SubmitApplication'))g('SubmitApplication').disabled=true;
			if(g('SubmitStatus1'))g('SubmitStatus1').innerHTML='<img src="'+(processingImageURL ? processingImageURL : '/images/i/processing1.gif')+'" /> Submitting Form.. ';
		}
	}catch(e){
		if(e.description || e.message){
			submitting=false;
			//let developer know their error checking or page is not set up right..
			window.open(submitFailURL+'?uid='+(typeof uid=='undefined'?'undefined':uid)+'&mode=ctrlFailure&set=1&page='+thispage+'&browser='+browser+'&error='+escape(e.description+':'+e.message),'w3');
		}
	}
	//document.getElementsByTagName('body')[0].style.cursor='wait'; 
	if(!overrideFailTimeout)setTimeout('submitFail('+(typeof failurecallfunction !=='undefined' ? '"'+failurecallfunction+'"' : '')+')',userWillTolerate*1000);
	return true;
}
function submitFail(failurecallfunction){
	if(!submitting)return;
	if(typeof uid=='undefined')uid='unknown';
	document.getElementsByTagName('body')[0].style.cursor='auto'; 
	try{
		if(typeof callfunction !=='undefined'){
			eval(callfunction);
		}else{
			g('SubmitApplication').disabled=false;
			g('SubmitStatus1').innerHTML=' ';
		}
	}catch(e){
		if(e.description || e.message){
			//alert developer the page is not set up right..
			window.open(sfpath+submitFailURL+'?uid='+uid+'&mode=ctrlFalure&set=2&page='+thispage+'&browser='+browser+'&error='+escape(e.description+':'+e.message),'w3');
		}
	}
	alert((submitFailMessage ? submitFailMessage : 'There was an error in submitting this information; it looks like it was not successful;\nPlease refresh this page and try one more time.'));
	window.open(sfpath+submitFailURL+'?uid='+uid+'&mode=email_emergency&page='+thispage+'&browser='+browser,'w3');
	submitting=false;
}
function focus_nav_cxl(queryMode, msg){
	if(typeof force=='undefined')force=0;
	if(typeof msg=='undefined')msg='You have changed this record\nClicking "OK" will close this page and changes will be lost (click "Cancel" to cancel and return to the record)';
	if(detectChange && !force && !confirm(msg)) return;
	window.close();
}
function focus_nav(navig,queryMode,force,postAdd, focusNavQuery){
	//version 1.3 updated 2007-03-11 - added ability to add query string additions by function
	//version 1.2 updated 2006-02-01 - handles new "remain" mode
	//added 2005-11-03
	/***
	Copied from VH1 v2.4.4 - changes noted [*]
	The function is designed to handle all requests that would be made in focus mode (similar to looking at an invoice in QuickBooks) Possible actions:
	1. navigate (next and previous)
	2. update and set for navigate
	3. update and set for closure
	4. insert new and set for new
	5. insert new and set for closure
	6. [insert new and set for navigate {previous}]
	7. close
	8. [return: for single window mode only]
	9. no action
	10. insert and set to remain - version 1.2
	***/
	if(navig){
		//new feature of previous nav request on an INSERT included
		if(detectChange){
			if(queryMode=='insert' || (force==1 || confirm('You have made changes, save them?')) ){
				//alert('#2 or #6');
				//#2. update and set for navigate
				//#6. insert new and set for nav [previous]
				g('navMode').value='navig'; // [*]
				g('nav').value=navig; // [*] - removed "null" prefix
				document.forms['form1'].submit();
				return;
			}
			//#9. Else no action
			//alert('#9');
			return;
		}
		//#1. Navigate - simplest request - gotten from environment variables exc. for navig
		//alert('#1'); // [*] - custom location, changed query string
		if(typeof focusNavQuery!=='undefined'){
			eval('var q='+focusNavQuery+';');
		}else var q='';
		window.location=thispage+'?navMode=navig&count='+count+'&abs='+ab+'&nav='+navig+q;
	}else{
		//possible requests to: update and kill, update and return, insert and new, insert and close
		if(detectChange){
			if(queryMode=='insert'){
				if(postAdd==2){
					//#10. insert and set to remain
					//alert('#10');
					g('navMode').value='remain';
					g('nav').value=''; // [*]
					document.forms['form1'].submit();
					return;
				}else if(postAdd==1){
					//#4. insert and set for new
					//alert('#4');
					g('navMode').value='insert'; // [*]
					g('nav').value=''; // [*]
					document.forms['form1'].submit();
					return;
				}else{
					//#5. insert and set for closure
					//(note: in single window mode, we'd return to last list)
					//alert('#5');
					g('navMode').value='kill'; // [*]
					g('nav').value=''; // [*]
					document.forms['form1'].submit();
					return;
				}
			}else{
				if(postAdd==2){
						//#10. insert and set to remain
						//alert('#10');
						g('navMode').value='remain';
						g('nav').value=''; // [*]
						document.forms['form1'].submit();
						return;
				}else if(force==1 || confirm('You have made changes, save them?')){
					//#3. update and set for closure
					//alert('#3');
					g('navMode').value='kill'; // [*]
					g('nav').value=''; // [*]
					document.forms['form1'].submit();
					return;
				}
				//#9. Else no action
				//alert('#9');
				return;
			}
		}else if(postAdd==2){
			//#10. insert and set to remain
			//alert('#10');
			g('navMode').value='remain';
			g('nav').value=''; // [*]
			document.forms['form1'].submit();
			return;
		}
		//#7. close - in single window mode we'd return to last list
		//alert('#7');
		window.close();
	}
}
function focus_nav_load(){
	//
	setTimeout('g("Next").onclick()',50);
}
function clear_form(ignores, sets, setLabels, formname, resetFunction){
	/**
	2007-02-25: hours and hours on this thing to make it x compatible - works but boy I need help with js.  I'm still shaky with checkboxes and radio buttons, not sure about select-multiples
	2007-02-07: this now has the ability to setLabels and ghosting
	Created 2005-12-02, ignores is a comma-delimited string like 'option1,option2'.  Sets references an array. This function needs a way to specifically NAME fields to clear and also needs to be more compact/elegant
	**/
	var ignore=new Array();
	if(typeof ignores!=='undefined'){
		var temp=ignores.split(',');
		for(i in temp)ignore[temp[i]]=1;
	}
	if(typeof sets=='undefined'){
		var sets=new Array();
	}
	if(typeof setLabels=='undefined')var setLabels= false;
	if(typeof formname=='undefined')var formname= 'form1';
	if(typeof document.forms[formname]=='undefined'){
		alert(formname+' does not exist');
		return false;
	}
	var e,id,tag,type;
	for(var j in document.forms[formname].elements){
		if(typeof document.forms[formname].elements[j]!=='object')continue;
		e=document.forms[formname].elements[j];
		//element id
		try{
			id='';
			id=e.getAttribute('id');
		}catch(e2){ if(e2.message || e2.description)continue; }
		if(!id)continue;
		//element tag name
		try{
			tag='';
			tag=e.tagName;
		}catch(e3){ if(e3.message || e3.description)continue; }
		if(!(tag=='INPUT' || tag=='SELECT' || tag=='TEXTAREA'))continue;
		//element type
		type='';
		if(g(id).getAttribute('type'))type=g(id).getAttribute('type');
		//ignore specified elements
		if(typeof ignore[id]!=='undefined')continue;
		if(typeof sets[id]!=='undefined'){
			if(type=='checkbox' || type=='radio'){
				g(id).checked=true;
			}else if(type!=='file'){
				g(id).setAttribute('value',sets[id]);
				var cn=g(id).className;
				if(cn.match(/\bghost/gi)) g(id).className = cn.replace('ghost',"noGhost");
			}
			continue;
		}
		//do not touch buttons or hidden fields
		if(type=='button' || type=='submit' || type=='hidden')continue;
		//clear the rest
		if(type=='checkbox' || type=='radio'){
			g(id).checked=(g(id).defaultChecked ? true : false);
		}else if(type=='file'){
			g(id).value='';
			var cn=g(id).className;
			if(cn.match(/\bghost/gi)) g(id).className = cn.replace('ghost',"noGhost");
		}else{
			if(setLabels && typeof labels[id]!=='undefined'){
				var cn=g(id).className;
				if(cn.match(/\bnoghost/gi)) g(id).className = cn.replace('noGhost',"ghost");
				g(id).value=labels[id];
			}else{
				g(id).value='';
				var cn=g(id).className;
				if(cn.match(/\bghost/gi)) g(id).className = cn.replace('ghost',"noGhost");
			}
		}
	}
	if(typeof resetFunction !=='undefined'){
		try{
			eval(resetFunction);	
		}catch(e){}
	}
}
function fill(txt,x,type){
	if(type==1 && x.value==txt){
		x.value='';
		x.className='noghost';
	}
	if(type==0 && x.value==''){
		x.className='ghost';
		x.value=txt;
	}
}
function countryInterlock(x, StateElementId, CountryElementId){
	a_state=g(StateElementId);
	a_country=g(CountryElementId);
	if(x==CountryElementId){
		switch(true){
			case a_country.value=='CAN' && !in_array(a_state.value, canada):
			case a_country.value=='USA' && (in_array(a_state.value, canada) || a_state.value=='UNK'):
				a_state.value='';
			break;
			case (a_country.value!=='' && a_country.value!='USA' && a_country.value!='CAN'):
				a_state.value='UNK';
			break;
		}
	}
	if(x==StateElementId){
		switch(true){
			case in_array(a_state.value, canada):
				a_country.value='CAN'; break;
			case a_state.value=='UNK' && (a_country.value=='USA' || a_country.value=='CAN'):
				a_country.value=''; break;
			case a_state.value!=='':
				a_country.value='USA';
		}
	}
}
function darken( f, mode ){
	typeof f=='undefined'?f='form1':'';
	typeof mode=='undefined'?mode='':'';
	labels['re_company']=' Company Name';
	labels['FirstName']=' First Name';
	labels['Email']=' Email';
	labels['MiddleName']=' M.N.';
	labels['LastName']=' Last Name';
	labels['Address']=' Address';
	labels['City']=' City';
	labels['Zip']=' Zip';
	labels['Phone']=' Phone';
	labels['WorkPhone']=' Work Phone';
	labels['Fax']=' Fax';
 	labels['UserName']=' User Name';
 	labels['MisctextParentnotes']=' Notes';
 	labels['MisctextChildnotes']=' Notes';
 	labels['MisctextStaffnotes']=' Notes';
 	labels['PagerVoice']=' Pager/Voice';
	labels['MailingAddress']=' Address';
	labels['MailingCity']=' City';
	labels['MailingZip']=' Zip';
	
	for(var x in labels){
      if(typeof document.forms[f].elements[x]=='undefined')continue;
      if(mode=='clear' && document.forms[f].elements[x].value=='')document.forms[f].elements[x].value=labels[x];
      if(document.forms[f].elements[x].value!=labels[x]){
			document.forms[f].elements[x].className='noGhost';
		}else{
			document.forms[f].elements[x].className='ghost';
		}
   }
}
function expandtext(txtSrcID,locus,next){
	if(typeof next!=='undefined') nextFocus=next;
	replID=txtSrcID;
	document.getElementById('panel').style.visibility='visible';
	var point=GetAbsolutePosition(document.getElementById(locus));
	document.getElementById('panel2').style.top=(point.y - 6)+'px';
	document.getElementById('panel2').style.left=(point.x - 407)+'px';
	document.getElementById('panel2').style.visibility='visible';
	document.getElementById('expanded').value=document.getElementById(txtSrcID).value;
	document.getElementById('expanded').focus();
	return;
}
function fillclose(o){
	document.getElementById(replID).value=o.value;
	document.getElementById('panel').style.visibility='hidden';
	document.getElementById('panel2').style.visibility='hidden';
	if(nextFocus) document.getElementById(nextFocus).focus();
}
function nav_query_add(){
	var str='&ResourceToken='+generate_date()+generate_rand(5);
	return str;
}
var newOptionWin=new Array();
function newOption(o, winURL, winName, winSize, winQuery){
	if(o.value!=='{RBADDNEW}')return;
	/*
	Created 2008-01-27
	TODO: make sure field population doesn't cause an error
	NOTE: when winName='rand' the system will generate a random number window name for the system
	it is possible to pass any additional query string to the target file, thus even overriding the value for cbSelect and cbTable
	the child window will store the object as the current object it's working on
	exe will know to pass the PK value back but the label must be stored on the server for security reasons, so variable labels could be stored as an attribute in the <select> element as label="[1 is default, anything else would ref a server setting]"
	*/
	//we want this done as soon as possible
	try{
	o.selectedIndex=(o.getAttribute('initialIndex') ? o.getAttribute('initialIndex') : 0);
	}catch(e){ }
	var rand=generate_date()+generate_rand(5);
	var url=winURL+'?';
	url+='cbSelect='+o.id
	url+=(o.getAttribute('cbTable')!=='' ? '&cbTable='+o.getAttribute('cbTable') : '');
	url+=(o.getAttribute('cbSchema') ? '&cbSchema='+o.getAttribute('cbSchema') : '');
	url+='&ResourceToken='+rand; //we add this even if the receiving object doesn't use quasi resources
	url+=(typeof winQuery!=='undefined' ? '&'+winQuery : '');
	if(winName=='rand'){
		//open completely new window
		winName=rand;
		newOptionWin[o.id]=rand;
		ow(url,'rand',winSize,winName);
	}else{
		//open in a predefined window name
		newOptionWin[o.id]=winName;
		ow(url,winName,winSize);
	}
	//mirror the dropdown list object in child
	wins[winName].pobject=o;
}
function newOptionSet(value, text, field, mode){
	if(typeof mode=='undefined')mode='trans';
	if(mode=='trans'){
		var o=window.opener.g(field);
		o.options[o.length]= new Option(text,value);
		o.selectedIndex=o.length-1;
	}else if(mode=='inpageadd'){
		try{
		g(field).options[g(field).length]= new Option(text,value);		
		}catch(e){ }
	}else{
		//reference the passed object in the child window ("this" window)	
	}
}
function simpleNew(o,ev){
	//added 2008-12-13 - works in conjunction with function relatebase_dataobjects_settings() for customized data bindings
	var reg=/_RBADDNEW$/;
	if(o.className=='cancelNewEntryButton'){
		o.previousSibling.previousSibling.value='';
		o.style.display='none';
		o.previousSibling.value='';
		o.previousSibling.style.display='none';
		o.previousSibling.previousSibling.style.display='inline';
	}else if(o.id.match(reg)){
		if((o.value=='' && typeof ev=='undefined') || (typeof ev!=='undefined' && ev.keyCode==38 /* up arrow */)){
			o.previousSibling.getAttribute('lastValue') ? o.previousSibling.value=o.previousSibling.getAttribute('lastValue') : o.previousSibling.selectedIndex=0;
			o.style.display='none';
			try{ o.nextSibling.style.display='none'; } catch(e){ }
			o.previousSibling.style.display='inline';
			o.previousSibling.focus();
		}	
	}else{
		 if(o.value=='{RBADDNEW}'){
			o.style.display='none';
			o.nextSibling.style.display='inline';
			try{ o.nextSibling.nextSibling.style.display='inline'; } catch(e){ }
			o.nextSibling.focus();
		}else{
			o.setAttribute('lastValue',o.value);
		}
	}
}
//auto-save coding
var autosaveTimelapse=0;
var autosaveTimeout=3; //every n seconds
var autosaveSubmitInterval=30;
var autosaveFormname='form1';
var autosaveIgnoreFields='|formatLikeThis|separateWithPipes|';
var vartest=0;
if(false){
	function getformstate(){
		/* note that if(e[i].id) is now further qualified because we may remove elements*/
		var thisformstate=[];
		var kyplus=0;
		var kyscrewie=0;
		var e=document.forms[autosaveFormname].elements;
		var screwie,screwie2;
		for(var i in e){
			if(typeof e[i]=='undefined')continue;
			screwie=null;
			screwie2=null;
			
			try{ t= (typeof e[i].id);   } catch(screwie){ }
			try{ t2=(typeof e[i].name); } catch(screwie2){ }
	
			if(!screwie && t!=='undefined'){
				ky=e[i].id;
			}else if(!screwie2 && t2!=='undefined'){
				kyplus++;
				ky=e[i].name+kyplus;
			}else continue;
			if(!ky){
				kyscrewie++;
				ky=kyscrewie;
			};//thanks IE, you're always on top of it..
			if(autosaveIgnoreFields.indexOf('|'+ky+'|')>-1)continue;
			thisformstate[ky]=(e[i].type=='radio' || e[i].type=='checkbox' ? e[i].checked : e[i].value);
		}
		return thisformstate;
	}
}
function getformstate(){
	var elem=document.forms[autosaveFormname].elements, e, i=0, arrayElelements=[];
	while(e=elem[i++]){
		if(e.type!='text'&&e.type!='checkbox'&&e.type!='radio'&&e.nodeName!='TEXTAREA'&&e.nodeName!='SELECT')continue;
		arrayElelements[arrayElelements.length]=e.value;
	}
	return arrayElelements;
}
var autosaveField='autosave';
var autosaveOn=1;
var autosaveOff=0;
var killautosave=false;
function autosave(){
	//2011-11-02: constant autosave
	if(killautosave)return;

	if(typeof formstate=='undefined')formstate=getformstate();
	if(autosaveTimelapse>=autosaveSubmitInterval){
		formstate=getformstate();
		autosaveTimelapse=0;
		try{
		window.status='Auto-saving document..';
		}catch(e){ }
		if(!g(autosaveField))alert('Developer: you must have a hidden field named "'+autosaveField+'" on this form');
		g(autosaveField).value=autosaveOn;
		document.forms['form1'].submit();
		g(autosaveField).value=autosaveOff;
	}else{
		var fs=getformstate();
		var i=0;
		for(var i in fs){
			if(fs[i]==formstate[i])continue;
			autosaveTimelapse+=autosaveTimeout;
			window.status=(typeof formName=='undefined' ? 'Form':formName)+' will be auto-saved in '+(autosaveSubmitInterval - autosaveTimelapse)+' seconds';
			break;
		}
	}
	setTimeout('autosave()',autosaveTimeout*1000);
}
function wc(){ window.close(); }