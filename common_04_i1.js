/*
	E-commerce site version 4.0.0
	-----------------------------
	2012-05-18: added qs() function
	2009-02-21: added function driver and s|g|iOpacity
	2009-01-21: added write_check() for grapefruit chopping :)
	2008-09-22: Cross-Updated Common Javascript Files. -AJ
	2008-01-24: added a bit of code to ow() for version 1.01
*/
var _COMMON_VERSION_=4.00;
var _COMMON_INSTANCE=1;

//----------------------- functions ----------------------------
function g(x){ return document.getElementById(x); }
function jsEval(x){
	try{
		eval(x);
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
function jsToggle(o){
	if(g('tester').style.display=='block'){
		o.src='/images/i/blue_tri_desc.gif';
		g('tester').style.display='none';
	}else{
		o.src='/images/i/blue_tri_asc.gif';
		g('tester').style.display='block';
	}
}
function gCookie(ck){
	var cVal = document.cookie;
	var cStart = cVal.indexOf(" " + ck + "=");
	if(cStart==-1)	cStart = cVal.indexOf(ck + "=");
	if(cStart == -1){
		cVal = null;
	}else{
		cStart = cVal.indexOf("=", cStart) + 1;
		var cEnd = cVal.indexOf(';', cStart);
		if(cEnd==-1) cEnd=cVal.length;
		cVal = unescape(cVal.substring(cStart,cEnd));
	}
	return cVal;
}
function sCookie(cName,cVal,cExp,cPath){
	if(typeof cVal=='undefined'){
		//remove the cookie (pass only one variable)
		var date = new Date();
		date.setTime(date.getTime()+(-1*24*60*60*1000));
		var expiry='; expires='+date.toGMTString();
		document.cookie = cName + "="+cVal + expiry+path;
		return;
	}
	cVal = escape(cVal);
	if(typeof cExp == 'undefined'){
		var nw = new Date();
		nw.setMonth(nw.getMonth() + 6);
		var expiry= ";expires="+nw.toGMTString();
	}else if(cExp==0){
		var expiry='';
	}else{
		var date = new Date();
		date.setTime(date.getTime()+(cExp*24*60*60*1000));
		var expiry='; expires='+date.toGMTString();
	}
	if(typeof cPath == 'undefined'){
		var path=';Path=/';
	}else{
		var path = ";Path="+cPath;
	}
	//if(testmode==1) alert(cName + "="+cVal + expiry+path);
	document.cookie = cName + "="+cVal + expiry+path;
}
function ow(href,w,p,rand){
	/* currently v1.01 2008-01-24
	   work to do:
	determine if the window is open and if there is unsaved data in it
	indicate in open window that a new url is coming up (gray out over window and text, moving icon pending)
	remember positions only if it works
	
	v1.01 - added the ability to add a random variable to the query (&ResourceToken) for setting quasi resource for a new object
	*/
	var params;
	if(typeof w=='undefined'){
		//develop - this is a "new" and distinct object
	}
	var reg=/^[0-9]+,[0-9]+$/;
	if(p.match(reg)){
		var a=p.split(',');
		params='width='+a[0]+',height='+a[1]+',resizable,scrollbars,menubar,status';
	}else{
		params=p;
	}

	//for new objects, creates a unique resource token for generating a "quasi resource" in the database, before the object is saved and recognized as an actual object - this allows for example to add a resource and associate sub-resources with it before the resource has an "official" ID number
	if(typeof rand!=='undefined'){
		rnd= ( parseInt(rand)>8000 ? rand : generate_date()+generate_rand(5) );
		href+=(href.indexOf('?')==-1 ? '?' : '&')+'ResourceToken='+rnd;
		//by default right now, we open this window in an absolutely new window each time - override the value of w
		w=rnd;
	}
	wins[w]=window.open(href,w,params);
	try{
		wins[w].focus();
	}catch(e){
		
	}
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
	return false;
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
function sizeof(x){//this gets count of elements in an array
	var f=0;for(var g in x){f++;}return f;}
function unset(val, arrName){
	//both passed values are strings
	var unset_buffer = new Array();
	eval('var arr = '+arrName);
	for(var x in arr){
		if(x.toLowerCase()!==(val+'').toLowerCase()){
			unset_buffer[x]=arr[x];
		}
	}
	eval(arrName+' = new Array();');
	eval(arrName+' = unset_buffer;');
	return false;
}
function addCartVis(ID,qty){
	for(i in currentProducts){
		if(currentProducts[i]==ID){
			g('prod'+currentProducts[i]).style.backgroundColor='#E1DDDD';
			g('added'+currentProducts[i]).style.visibility='visible';
		}else{
			g('prod'+currentProducts[i]).style.backgroundColor='#FFF';
			g('added'+currentProducts[i]).style.visibility='hidden';
		}
	}
}
function generate_date(x){
	if(typeof x=='undefined') x=3; //range 0,1,2,3
	var y=new Date();
	var l=(y.getYear().toString().length);
	var s=y.getYear().toString().substr(l-1,1);
	s+=str_pad(y.getMonth()+1,2) + str_pad(y.getDate(),2);
	s+=str_pad(y.getHours(),2) + str_pad(y.getMinutes(),2) + str_pad(y.getSeconds(),2);
	return s;
}
function generate_rand(d){
	if(typeof d=='undefined')d=8;
	var b=10;
	var s=Math.random();
	for(i=1;i<=d-1;i++)b=b*10;
	s=str_pad(parseInt(s*b).toString(),d,0,2);
	return s;
}
function str_pad(str, nbr, pad, posn){
	str=str.toString();
	if(str.length>=nbr)return str;
	if(typeof pad=='undefined')pad='0'; //pad left
	if(typeof posn=='undefined')posn=1; //pad left
	var p='';
	for(i=1; i<=nbr-str.length; i++)p+=pad;
	var o=(posn==1 ? p+''+str : str+''+p);
	return o;
}
/* GetSourceElement: find the source element of given event. */
function GetSourceElement(e){
	//---- version 1.0, by Yahav, last edit 2005-01-10
	var node;
	if (!e) var e = window.event;
	if (e.target) node = e.target;
	else if (e.srcElement) node = e.srcElement;
	if (node.nodeType == 3) // defeat Safari bug
		node = node.parentNode;
	/* -- I believe this code is no longer needed -- */
	if(false){
	while (node.nodeType != node.ELEMENT_NODE)
		node = node.parentNode;
	}
	//catch(err){ }
	return node;
}
function GetAbsolutePosition(element, P) {
	//alert(element.nodeName+"\n"+element.offsetLeft+"\n"+element.offsetTop);
	if (typeof P == "undefined")P = new Point(0, 0);
	if (element.nodeName.toLowerCase() == "body") return P;
	if (!((element.nodeName.toLowerCase() == "tr")&&(element.parentNode.nodeName.toLowerCase() == "tbody")))
		P.x += element.offsetLeft;
	if (!((element.nodeName.toLowerCase() == "td")&&(element.parentNode.nodeName.toLowerCase() == "tr")))
		P.y += element.offsetTop;
	return GetAbsolutePosition(element.parentNode, P);
}
function Point(x, y) {
	this.x = x;
	this.y = y;
}
function adminAccessMin(){
	var d=g('amMin').innerHTML;
	if(d=='+'){
		g('amMin').innerHTML='-';
		g('amMin').title='Minimize Admin Toolbar';
		g('amBody').style.display='block';
		sCookie('amBody','block');
	}else{
		g('amMin').innerHTML='+';
		g('amMin').title='Expand Admin Toolbar';
		g('amBody').style.display='none';
		sCookie('amBody','none');
	}
	return false;
}
function getPageOffset(point){
	//http://dev.communityserver.com/forums/t/477071.aspx
	if(typeof window.pageXOffset == 'number'){
		//Netscape compliant
		return (point=='left'?window.pageXOffset:window.pageYOffset);
	}else if (document.body && (document.body.scrollLeft || document.body.scrollTop)){
		//DOM compliant
		return (point=='left'?document.body.scrollLeft:document.body.scrollTop);
	}else if(document.documentElement){
		//IE6 standards compliant mode
		return (point=='left'?document.documentElement.scrollLeft:document.documentElement.scrollTop);
	}
}
function showFeatured(file,node){
	g('Background').innerHTML='/images/'+node+(node?'/':'')+file;
	g('backgroundImage').value=file;
	g('backgroundImageFolder').value=folder;
}
function refreshList(){
	window.location+='';
}
if(typeof refreshComponentExeURL=='undefined')refreshComponentExeURL='/console/resources/bais_01_exe.php';
function refreshComponent(id,refreshParams,query){
	/*
	2008-11-17
	added refreshComponentExeURL to allow custom exe page url
	2008-09-19
	Created 2008-09-18 by Samuel - takes either a 2nd parameter of refresh parameters that have to be sent to exe, or a 3 "prepared" querystring.  If neither parameter is passed, the function looks in the object for attribute refreshParams="Events_ID:ID" (e.g.)
	if stored in the data object component, refreshParams is a comma-separated list of parameters that need to be passed to recreate that component in context.  If any param is aliased, enter it as Events_ID:ID - this function will look for ID but pass it as Events_ID.
	the function looks first in any hidden field by that id for the value, then in a global value by that name.  If neither is present the system will return an error - this enforces (I think) good consistent coding
	
	*/
	if(id.match(':')){
		passid=id.split(':')[0];
	}else{
		passid=id;
	}
	if((a=g(passid))==null) alert('function refreshComponent()[Error 1]: non-existent component id '+id);
	//now get refreshparameters
	if(query){
		//OK - we have an explicit query string	
	}else if(typeof refreshParams!=='undefined'){
		//OK - we must get params from the environment
	}else if((refreshParams=a.getAttribute('refreshparams'))==null){
		alert('function refreshComponent()[Error 2]: non-existent component id '+id);
	}
	if(!query && !refreshParams)return false;
	if(!query){
		var query='';
		var a=refreshParams.split(',');
		for(var j in a){
			//search in hidden field by that id, then global by that name
			if(a[j].match(':')){
				a[j]=a[j].split(':');
				pass=a[j][0];
				field=a[j][1];
			}else{
				pass=a[j];
				field=a[j];
			}
			if(g(field)!==null){
				//build query string
				query+='&'+pass+'='+escape(g(field).value);
			}else{
				test='undefined';
				eval('test=typeof '+field+';');
				if(test!=='undefined'){
					//build query string
					query+='&'+pass+'='+escape(g(field).value);
				}else{
					alert('function refreshComponent()[Error 3]: unable to find refresh parameter "'+field+'"'+(pass!=field?' (will be passed as '+pass+')':''));
					return false;
				}
			}
		}
	}
	if(!query){
		alert('function refreshComponent()[Error 4]: unable to successfully generate query string');
		return false;
	}
	if(query.substring(0,1)!=='&')query='&'+query;
	window.open(refreshComponentExeURL+'?mode=refreshComponent&version=4.0&component='+id+query,'w2');
}
function write_check(e,t,c,s){
	var a='&';
	var n='#';
	e=e.replace(/,/g,';'+a+n);
	e=e.replace(';','');
	/* removed 2013-08-07, see following lines
	t=t.replace(/,/g,';'+a+n);
	t=t.replace(';','');
	t+=';';
	*/
	var _t='';
	t=t.replace(/^,/,'').split(',');
	for(var i in t)_t+=String.fromCharCode(t[i]);
	t=_t;
	var s1='%3c%61%20%68%72%65%66%3d%22%6d%61%69%6c%74%6f%3a';
	var s2='%3c%2f%61%3e';
	document.write(unescape(s1)+e+'"'+(typeof c!='undefined'?' class="'+c+'"':'')+(typeof s!='undefined'?' style="'+s+'"':'')+'>'+t+unescape(s2));
}
function gOpacity(o){
	return parseInt( browser=='IE' ? g(o).style.filter.match(/[0-9]+/) : g(o).style.MozOpacity*100)/100;
}
function sOpacity(o,v){
	browser=='IE' ? g(o).style.filter='alpha(opacity='+(v*100)+')' : g(o).style.MozOpacity=v;
}
function iOpacity(o,v){
	var op=gOpacity(o);
	op+=v;
	op > 1 ? op=1 : op < 0 ? op=0 : '';
	sOpacity(o,op)
	return op;
}
function driver(f, id, token){
	/* version 1.0 created 2009-02-13 */
	if(typeof token=='undefined')token=parseInt(Math.random()*100000);
	
	//filter out calls in mid-process
	if(timelapse_inprocess[f] && timelapse[f]!==token) return false;

	timelapse[f]=token;
	timelapse_inprocess[f]=true;
	setTimeout(f+'('+token+');',(timelapse_interval[f] ? timelapse_interval[f] : 10));

}
function getParentMatching(o,m){
	/* simple function created 2009-08-12 */
	if(!o.parentNode)return;
	try{
	if(o.parentNode.id.match(m))return o.parentNode;
	return getParentMatching(o.parentNode,m);
	}catch(e){ }
}
function getChildMatching(o,m){
	var a;
	if(o.id && o.id.match(m))return o;
	if(!o.childNodes)return;
	for(var i in o.childNodes){
		if(!o.childNodes[i].tagName)continue;
		try{ var r=o.childNodes[i].id.match(m) }catch(e){ }
		if(r)return g(o.childNodes[i].id);
		if(o.childNodes[i].childNodes){
			p=getChildMatching(o.childNodes[i],m);
			if(p)return p;
		}
	}
}
function trim(s){
	if(typeof s=='undefined')return;
	s=s.replace(/^\s+/,'');
	s=s.replace(/\s+$/,'');
	return s;
}
function number_format(n,p,o){
	//added 2011-04-09
	var foptions=(typeof o!='undefined');
	var nx=(p==0 ? parseInt(n) : parseFloat(n));
	if(isNaN(nx))return n;
	if(!p)return nx;

	//get position of period
	var a=(nx+'').split('.');
	if(a.length==2){
		if(a[0].length==0)a[0]='0';
	}else{
		//presume 1 -- we have no a[1]
	}
	if(typeof a[1]=='undefined')a[1]='';
	if(a[1].length>=p)return a[0]+'.'+a[1].substr(0,p);
	//truncate
	var m=a[1];
	for(i=1; i<=p-a[1].length; i++)m=m+'0';
	return a[0]+'.'+m;
}
function insertAfter( ref, n ){
	// This function inserts newNode after referenceNode
	//http://www.netlobo.com/javascript-insertafter.html
	ref.parentNode.insertBefore(n, ref.nextSibling);
}
function qs(a){
	/*
	2012-05-18
	specifications:
		* currently default method is #form1 input[type=hidden] - no variance from that; this function will collect all those values
		* omit:field1,field2
		* noblanks[default=true]; will not pass blank values but will pass 0
		* fields:field1,field2 - additional form fields to get values for
		* setpage - whether or not to add the page to the string
		* page[default={this page}] can also be global
	*/
	var str='';
	var omit=(a['omit']||'');
	omit+=',';
	if(typeof a['noblanks']=='undefined')a['noblanks']=true;
	if(typeof a['setpage']=='undefined')a['setpage']=true;
	var b=$('#form1 input[type=hidden]').get();
	for(var i in b){
		if(omit.indexOf(b[i].id+',')>-1)continue;
		if(a['noblanks'] && !b[i].value.length)continue;
		str+=b[i].id+'='+escape(b[i].value)+'&';
	}
	if(a['fields']){
		b=a['fields'].split(',');
		for(i in b){
			if(a['noblanks'] && !g(b[i]).value.length)continue;
			str+=b[i]+'='+escape(g(b[i]).value)+'&';
		}
	}
	if(a['additional'])str+=a['additional'];
	str=str.replace(/&$/,'');
	if(a['setpage'] || a['page']){
		if(!a['page']){
			var p=window.location+'';
			p=p.split('?')[0];
			p=p.split('/');
			a['page']=p[p.length-1];
		}
		str=a['page']+'?'+str;
	}
	return str;
}
