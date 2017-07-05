/****
common_i1_v200.js - only essential functions from previous versions
Components:
1. var declarations
2. functions
3. onload event controllers


****/


//----------------------------- Var declarations -----------------------------
var _COMMON_INSTANCE=1;
var _COMMON_VERSION=2;
window.onload=rb_onload;	//RelateBase onload

var m_onloadCmds=new Array();
var m_onkeypressCmds=new Array();
var bugReportSubmitted=false;
var arrAppendedItems=new Array();
var L,T,W,H;
var testmode=0;
//used in rb_onclick(ev) but may not be needed
var called=1;
var esk;
var eck;
var eak;
var obsep1='.'; var valsep1='='; var decsep1='^';
var bugReportSubmitted=false;
var arrAppendedItems=new Array();

//these are stored by the context menu script - have not been used as of 2006-07-01
//last source object:
var rb_cm_lastObject=false;
//last selected text:
var rb_strLastSelection="";
function LastSourceObject(){
	return rb_cm_lastObject;
}
function GetLastSelection(){
	return rb_strLastSelection;
}

var op=new Array();
op['block']='none';
op['none']='block';
op['visible']='hidden';
op['hidden']='visible';
op['menu']='highlight';
op['highlight']='menu';
op['+']='-';
op['-']='+';



//----------------------------- Functions -----------------------------
function g(x){
	return document.getElementById(x);
}
function jsEval(x){
	try{
		eval(g(x).value);
	}catch(e){
		var v1=''; var v2=''; var v3=''; var str=''; var descr=false;
		for(j in e){
			if(j=='stack' || j=='number')continue;
			if((j=='message' || j=='description') && descr)continue
			if(j=='description' || j=='message')descr=true;
			str+=(j+': '+e[j])+"\n";
		}
		if(str) alert(str);
	}
	return false;
}
function GetSourceElement(event){
	//---- version 1.0, by Yahav, last edit 2005-01-10
	if ((typeof event == "undefined") || (!event))
		event = window.event;
	if (typeof event.srcElement != "undefined")
		return event.srcElement;
	var node = event.target;
	while (node.nodeType != node.ELEMENT_NODE) node = node.parentNode;
	return node;
}
function gCookie(ck){
	var cVal = document.cookie;
	var cStart = cVal.indexOf(" " + ck + "=");
	if(cStart==-1){
		cStart = cVal.indexOf(ck + "=");
	}
	if(cStart == -1){
		cVal = null;
	}else{
		cStart = cVal.indexOf("=", cStart) + 1;
		var cEnd = cVal.indexOf(';', cStart); 
		if(cEnd==-1){
			cEnd=cVal.length;
		}
		cVal = unescape(cVal.substring(cStart,cEnd));
	}
	return cVal;
}
function sCookie(cName,cVal,cPath,cExp){
	cVal = escape(cVal);
	if(cExp=='' || typeof cExp == 'undefined'){
		var nw = new Date();
		nw.setMonth(nw.getMonth() + 6);
		cExp=nw.toGMTString();
	}
	if(typeof cPath == 'undefined'){
		var cPath=';Path=/';
	}else{
		var cPath = ';Path='+cPath;
	}
	document.cookie = cName + "="+cVal + cExp + cPath;
}
function arr_enc(x){
   //encodes a string for .^=
   if(typeof x!='string')return x; x=x.replace('&','&'); x=x.replace(obsep1,'.'); x=x.replace(valsep1,'='); x=x.replace(decsep1,'ˆ'); return x;
} //---------- end arr_enc() -------------

function arr_dec(x){
   //decodes a string for .^=
   if(typeof x!='string')return x; x=x.replace('.', obsep1); x=x.replace('=', valsep1); x=x.replace('ˆ', decsep1); x=x.replace('&','&'); return x;
} //---------- end arr_dec() -------------
function str1_arr(str){
	//converts cookie string into array
	var obsep1='.'; var valsep1='='; var decsep1='^';
	var arr=new Array();
	var barr=str.split(decsep1);
	var buffer='';
	for(var x in barr){
		var a=barr[x].indexOf('.');
		var b=barr[x].indexOf('=');
		if(a!=-1 && a<b){
			y=barr[x].split('=');
			z=y[0].split('.');
			if(z.length>2)alert('Error: too many sub-indexes! (2 max)');
			if(z[0]!=buffer){
				buffer=z[0];
				arr[arr_dec(z[0])]=new Array();
			}
			arr[arr_dec(z[0])][arr_dec(z[1])]=arr_dec(y[1]);
		}else{
			//string
			y=barr[x].split('=');
			arr[arr_dec(y[0])]=arr_dec(y[1]);
		}
	}
	return arr;
}
function arr_str1(arr){
   //converts array to string for cookies
   var str='';
   for(var x in arr){
		if(typeof arr[x]=='object'){
			for(var y in arr[x]){
				str+=arr_enc(x)+obsep1+arr_enc(y)+valsep1+arr_enc(arr[x][y])+decsep1;
			}
		}else if(typeof arr[x]=='number' || typeof arr[x]=='string'){
			str+=arr_enc(x)+valsep1+arr_enc(arr[x])+decsep1;
		}
	}
   str=str.substr(0,str.length-1);
	return str;
}
function newWindow(myhref,wName,params){
	//get the cookie
	var c;
	var paramsDim;
	var ltpresent=false;
	var whpresent=false;
	if(c = gCookie('wPositions')){
		//open the window with those params
		try{
			var a = c.split('|');
			eval( 'var reg = /^'+ wName + ',/i' );
			for(var i in a){
				if(a[i].match(reg)){
					var b = a[i].split(',');
					//I added these otherwise the page drifts. Unfortunately these positions aren't from the corner
					b[1]-=0;  //width
					b[2]-=0; //height
					b[3]-=0;  //left
					b[4]-=0; //top
					//note: if length !== 5 we have a problem
					paramsDim =  'screenX='+b[3]+',screenY='+b[4]+',left='+b[3]+',top='+b[4]
					paramsDim += ',width='+b[1]+',height='+b[2];
					var l=b[3]; var t=b[4];
					var w=b[1]; var h=b[2];
					ltpresent=true;
					whpresent=true;
					break;
				}
			}
		}
		catch(e){
			if(e.description)alert(e.description);
		}
	}
	if(typeof params=='undefined') params='';
	var reg=/^-*[0-9]+,-*[0-9]+$/;
	if(paramsDim){
		if(params){
			if(params.match(reg)){
				//replace HWLT values with cookie, add SMSR
				params = paramsDim+',scrollbars,menubar,status,resizable';
			}else{
				//replace the WHLT params
				var reg1=/,*height=[0-9]*/i
				var reg2=/,*width=[0-9]*/i
				var reg3=/,*top=[0-9]*/i
				var reg4=/,*left=[0-9]*/i
				var reg5=/,*screenX=[0-9]*/i
				var reg6=/,*screenY=[0-9]*/i
				params=params.replace(reg1,'');
				params=params.replace(reg2,'');
				params=params.replace(reg3,'');
				params=params.replace(reg4,'');
				params=params.replace(reg5,'');
				params=params.replace(reg6,'');
				params+=','+paramsDim;
			}
		}else{
			params = paramsDim+',scrollbars,menubar,status,resizable';
		}
	}else{
		if(params.match(reg)){
			var x = params.split(',');
			params='width='+x[0]+',height='+x[1];
			params+=',scrollbars,menubar,status,resizable';
			var w=x[0]; var h = x[1];
			whpresent=true;
			
		}
	}
	eval(wName+"=window.open('',wName"+(params?",params":"")+");");
	//another reason I love this job..
	//if(ltpresent && parseInt(l) && parseInt(t))eval(wName+".moveTo("+ l + ',' + t + ");");
	//if(whpresent && parseInt(w) && parseInt(h))eval(wName+".resizeTo("+ w + ',' + h + ");");
	eval(wName+".document.write('Loading, please wait...');");
	eval(wName+".document.location = myhref;");
	eval(wName+".window.focus();");
	return false;
}
function sizeof(x){
	//this gets count of elements in an array
	var f=0;
	for(var g in x)f++;
	return f;
}
function unset(val, arrName){
	//both passed values are strings
	var unset_buffer = new Array();
	eval('var arr = '+arrName);
	for(var x in arr){
		if(x.toLowerCase()!==val.toLowerCase()){
			unset_buffer[x]=arr[x];
		}
	}
	eval(arrName+' = new Array();');
	eval(arrName+' = unset_buffer;');
	return false;
}
function in_array(needle,haystack){//about the same as the function in PHP
	strCase=1; //insensitive (2=sensitive)
	loc=10; //value (11=key)
	for(i=2;i<arguments.length;i++){
		arguments[i]=='sensitive' || arguments[i]==2?strCase=2:'';
		arguments[i]==11 || arguments[i]=='key'?loc=11:'';
	}
	//find the value
	for(j in haystack){
		if(strCase==1){
			if(loc==10 && (haystack[j]+'').toLowerCase()==(needle+'').toLowerCase()){
				return true;
			}else if(loc==11 && (j+'').toLowerCase()==(needle+'').toLowerCase()){
				return true;
			}
		}else{
			if((loc==10 && haystack[j]==needle) || (loc==11 && j==needle)){
				return true;
			}
		}
	}
}
function delete_element(array, n){//removes an element from an array by key value
  //delete the nth element of array
  var length = array.length;
  if (n >= length || n<0)
    return;
  for (var i=n; i<length-1; i++)
    array[i] = array[i+1];
  array.length--;
}
function sub_bugrpt(keyFormName){
	//---- version 1.0, by Yahav, last edit 2004-07-28
	//note: old function can be found in common_i1_v100_bk209.js
	//modified: 28/07/2004 by Yahav (javateam)
	//reason: fixed object allocation, fixed form losing action and target. FUNCTION IS NOW OK.
	//addition: modified so that bug report opens in custom window and after submission removes the additional fields.	
	//already submitted for this page?
	if (bugReportSubmitted == true){
		//the form has already been appended
		alert('A bug report can only be submitted once per page');
		return false;
	}
	//check if the form name given:
	switch(true){
		case (typeof keyFormName=='undefined'):
			keyFormName='form1'; break;
		case (keyFormName ==''):
			keyFormName='form1'; break;
	}
	//make pointer to the form object so we can append fields:
	var objForm=eval("document."+keyFormName);
	if (typeof objForm == 'undefined'){
		//need to create it...
		objForm=document.createElement("form");
		objForm.name = keyFormName;
		objForm.action = "";
		objForm.target = "";
		objForm.method = "Get";
		//append to main body:
		document.body.appendChild(objForm);
	}
	//store original:
	var strOldAction, strOldTarget, strOldMethod;
	strOldAction = objForm.action;
	strOldTarget = objForm.target;
	strOldMethod = objForm.method;
	//make the window custom:
	newWindow('/client/admin/br_0.9/index.php', 'l1_bugreports','width=540,height=350,menubar,resizable,scrollbars,status');
	objForm.action = "/client/admin/br_0.9/index.php";
	objForm.target = "l1_bugreports";
	objForm.method = "post";
	//append fields:
	/** note all get _br_ prepended. **/
	(typeof scriptID!='undefined')?
		objForm.appendChild(CreateHiddenField("br0001", "_br_scriptID", scriptID)):'';
	(typeof scriptVersion!='undefined')?
		objForm.appendChild(CreateHiddenField("br0002", "_br_scriptVersion", scriptVersion)):'';
	(typeof fileType!='undefined')?
		objForm.appendChild(CreateHiddenField("br0003", "_br_fileType", fileType)):'';
	(typeof keyFormName!='undefined')?
		objForm.appendChild(CreateHiddenField("br0004", "_br_keyFormName", keyFormName)):'';
	(typeof __FILE__!='undefined')?
		objForm.appendChild(CreateHiddenField("br0005", "_br___FILE__", __FILE__)):'';
	(typeof PHP_SELF!='undefined')?
		objForm.appendChild(CreateHiddenField("br0006", "_br_PHP_SELF", PHP_SELF)):'';
	(typeof GLOBALS!='undefined')?
		objForm.appendChild(CreateHiddenField("br0007", "_br_GLOBALS", GLOBALS)):'';
	//submit:
	objForm.submit();
	//restore old values and remove fields:
	objForm.action = strOldAction;
	objForm.target = strOldTarget;
	objForm.method = strOldMethod;
	for (i=0; i<arrAppendedItems.length; i++)
		objForm.removeChild(arrAppendedItems[i]);
	bugReportSubmitted = true;
	return false;
}
function CreateHiddenField(strID, strName, strValue){
	//---- version 1.0, by Yahav, last edit 2004-07-27
	//creates and returns new input tag object
	var objInput=document.createElement("input");
	objInput.type = "hidden";
	objInput.id = strID;
	objInput.name = strName;
	objInput.value = strValue;
	//store for later use...
	arrAppendedItems[arrAppendedItems.length] = objInput;
	return objInput;
}
function PrintObj(_ob){
	//---- version 1.0, by Yahav, last edit 2004-10-15
	var m="", j;
	for (j in _ob)
		m += j+": "+_ob[j]+", ";
	m = m.substr(0, m.length-2);
	alert(m);
}



//----------------------------- Onload and event controllers -----------------------------
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

function rb_onkeypress(evt){
	//---- version 1.1, by Sam, last edit 2005-07-23
	//for any function desiring to use the event, refer to evt as one of the parameters
	//having trouble with this: var elem = (evt.target) ? evt.target : evt.srcElement;
	if(!m_onkeypressCmds.length)return;
	for(var i in m_onkeypressCmds){
		try{ eval( m_onkeypressCmds[i]); }
		catch(e){ if(e.description)alert(e.description); }
	}
}
function rb_onclick(ev){
	if(typeof ev=='undefined' && typeof event!=='undefined') ev=event;
	esk=ev.shiftKey;
	eck=ev.ctrlKey;
	eak=ev.altKey;
	called++;
	window.status='Called '+called;
}
function rb_onload(){
	//---- version 1.0, by Yahav, last edit 2004-09-24
	//simply execute commands:
	for (var i=0; i<m_onloadCmds.length; i++){
		try{
			eval(m_onloadCmds[i]);
		}
		catch (e){
			alert("warning: failed to initialize page. command failed: \n"+m_onloadCmds[i]+"\nerror: \n"+e.description+"\nplease report.");
			return false;
		}
	}
	if (m_onkeypressCmds.length > 0){
		document.onkeypress=rb_onkeypress;
		/***
		document.onkeypress=function rb_keypress(){
			for (var j=0; j<m_onkeypressCmds.length; j++)
			{
				try
				{
					eval(m_onkeypressCmds[j]);
				}
				catch (e)
				{
				}
			}
		}
		***/
	}
}