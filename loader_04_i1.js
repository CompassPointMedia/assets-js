/*
	E-commerce site version 4.0.0
	-----------------------------
2011-04-27: see this link: http://www.webreference.com/programming/javascript/onloads/
as a possible way to replace the onload command rb_onload, is that any better..

*/
var _LOADER_VERSION_=4.00;
var _LOADER_INSTANCE=1;

window.onload=rb_onload;	//RelateBase onload
document.onclick=rb_onclick;
var esk;
var eck;
var eak;
//declare onload commands:
var m_onloadCmds=new Array(); //private - use only public functions to alter it!
var m_onkeypressCmds=new Array(); //private - use only public functions to alter it!
function rb_onkeypress(e){
	if(!e)e=window.event;
	//---- version 1.1, by Sam, last edit 2005-07-23
	//for any function desiring to use the event, refer to evt as one of the parameters
	//having trouble with this: var elem = (evt.target) ? evt.target : evt.srcElement;
	if(!m_onkeypressCmds.length)return;
	for(var i in m_onkeypressCmds){
		try{
			eval( m_onkeypressCmds[i]);
		}
		catch(e){ if(e.description)alert(e.description); }
	}
}
function rb_onclick(evt){
	if(typeof evt=='undefined' && typeof event!=='undefined') evt=event;
	esk=evt.shiftKey;
	eck=evt.ctrlKey;
	eak=evt.altKey;
}
function rb_onload(){
	//---- version 1.0, by Yahav, last edit 2004-09-24
	//simply execute commands:
	for(var i=0; i<m_onloadCmds.length; i++){
		try{
			eval(m_onloadCmds[i]);
		}
		catch (e){
			//alert("warning: failed to initialize page. command failed: \n"+m_onloadCmds[i]+"\nerror: \n"+e.description+"\nplease report.");
			window.status='failed to run command';
			return false;
		}
	}
	if(m_onkeypressCmds.length > 0)document.onkeypress=rb_onkeypress;
}
function AddOnloadCommand(strCommand){
	//---- version 1.0, by Yahav, last edit 2004-09-24
	//add to array of commands:
	m_onloadCmds[m_onloadCmds.length] = strCommand;
}
function AddOnkeypressCommand(strCommand){
	//---- version 1.0, by Yahav, last edit 2004-12-14
	//add to array of commands:
	m_onkeypressCmds[m_onkeypressCmds.length] = strCommand;
}


//---------- these are specific functions the loader might be needed to call; be careful about implementation ----------
var escMessage='You will lose the changes you have made to this page.  Continue?';
var whichKey=false;
var customDeleteHandler='';
var documentForm='form1';
function PropKeyPress(e){
	if(!e)var e=window.event;
	var k=(e.keyCode ? e.keyCode : e.which);
	var s=e.shiftKey;
	var a=e.altKey;
	var c=e.ctrlKey;
	if(whichKey)alert(k);
	if(k==27){
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		if(isEscapable==2 || (isEscapable==1 && (!detectChange || (detectChange && confirm(escMessage))))){
			//eventually, deal with window to focus on onClose
			window.close();
			return false;
		}
	}
	//deletion
	if(k==100 && c && isDeletable){
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		if(customDeleteHandler){
			eval(customDeleteHandler);
			return false;
		}
		if(confirm('This will permanently delete this record.  Continue?')){
			if(!g('deleteMode')){ alert('No delete mode declared'); return false; }
			if(g('mode').value==g('insertMode').value){
				alert('This is a new record');
				return false;
			}
			g('mode').value=g('deleteMode').value;
			g('navMode').value='delete';
			document.forms[documentForm].submit();
			return false;
		}
	}
	if(s && c && (k==16)){
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		try{
			window.opener.focus();
		}catch(err){ }
	}
}