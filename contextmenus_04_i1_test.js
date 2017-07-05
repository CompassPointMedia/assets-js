/*
	E-commerce site version 4.0.0
	-----------------------------


	2009-11-15
		* moved rb_cm_lastObject to before precalculated so it can be used
		* made repairs in positionmenuie5, cleaned up
		* added 3rd param alignment to AssignMenu()
	2008-10-18: Starting upgrade of coding, cleaning up etc. --SF
		* added cmBoundToElement = the element to which the context menu is bound
		* added override_hidemenuie5=false for cpm071 pop-up application (imgmanager widget)

	2008-09-22: Cross-Updated context menus --AJ
	This context menu file requires a few prereq functions, after that you may simply drop it in place and add the 
	following code in your document:
	
		<script language="JavaScript">
		//assign context menu to id(s)
		try{
			AssignMenu('^(d)*node_', 'menu1'); //assigns all ids like dnode_1, dnode_2, node_5 to menu1
		}catch(e){ /* alert if you desire * / }
		</script>
	
	TODO:
	better understanding of load and onload so no conflicts with other pages
	onclick events need integrated as well

*/
var _CONTEXTMENUS_VERSION_=4.00;
var _CONTEXTMENUS_INSTANCE=1;

var menuType='regexp'; //must be 'normal', or 'regexp', default is regexp
var cmMenuID='';
var cmBoundToElement=''; //this is the element the menu is bound to
var hm_cxl=0;
var hm_cxlseq=0;
var option_hm_cxl=0;
var menuLvl=new Array();
var menuMap=new Array();
var rMenuMap=new Array();	//private, make sure to use public AssignMenu function.
var menuAlign=new Array();
//holds the status message during mouseovers, initially set to blank
var statusBuffer='';
//last source object:
var rb_cm_lastObject=false;
//last selected text:
var rb_strLastSelection="";

//added 2006-02-16
var disabledOptionHighlight='highlight';
var disabledOptionHighlightTextColor='#ccc';
var optionHighlight='highlight';
var optionHighlightTextColor='#FFF';
var disabledOptionTextColor='#ccc';
var override_hidemenuie5=false;

AddOnloadCommand("document.oncontextmenu = showmenuie5;");
AddOnloadCommand("document.body.onclick = hidemenuie5;");

function AssignMenu(strRegExpId, strMenuName, alignment){
	rMenuMap[strRegExpId] = strMenuName;
	menuAlign[strRegExpId] = (typeof alignment=='undefined' ? "mouse" : alignment);
}

function LastSourceObject(){ return rb_cm_lastObject; }
function GetLastSelection(){ return rb_strLastSelection; }
function showmenuie5(event, lvl, skipRootID) {
	//reset cmMenuID and element menu is bound to
	cmMenuID='';
	cmBoundToElement='';
	if(typeof event == "undefined") event = window.event;
	if(typeof skipRootID=='undefined')skipRootID=false;
	
	//2007-03-06: allows user to hold shift key and bypass my context menu
	if(event.shiftKey){
		hidemenuie5(event, 0);
		return true;
	}
	if(typeof lvl == "undefined")lvl = 0;
	var mynode=0;
	if(GetSourceElement(event).getAttribute("id") && !skipRootID) {
		mynode = GetSourceElement(event);
	} else if(GetSourceElement(event).parentNode.getAttribute("id")) {
		mynode = GetSourceElement(event).parentNode;
	} else if(GetSourceElement(event).parentNode.parentNode.getAttribute("id")) {
		mynode = GetSourceElement(event).parentNode.parentNode;
	} else {
		if (!event.altKey) hidemenuie5(event, 0);
		return true;
	}
	if(in_array(mynode.id, menuLvl)) {
		alert('Use the left click button to select an option');
		return false;
		//unset the array elements -- not developed
		//handle the click -- which may open another submenu for that matter -- not developed
		//return false to stop IE context menu -- not developed
		return false;
	}
	//search for id based on normal or regex method, see arrays
	if(menuType=='normal'){
		cmMenuID=menuMap[mynode.id];
		var align=menuAlign[mynode.id];
	}else if(menuType=='regexp'){
		for(x in rMenuMap){
			eval( 'reg=/'+x+'/;' );
			if(mynode.id.match(reg)){
				var align=menuAlign[x];
				cmMenuID=rMenuMap[x];
				break;
			}
		}
	}
	cmBoundToElement=mynode.id;
	if(!cmMenuID){
		//hide all menus
		//prevent endless loop:
		if (!event.altKey) hidemenuie5(event, 0);
		return true;
	}
	var objMenu=g(cmMenuID);
	if(!objMenu){
		alert("The RelateBase context menu " + cmMenuID + " is not defined");
		return false;
	}
	//hide all other menus
	//prevent endless loop:
	if (!event.altKey) hidemenuie5(event, lvl);

	//store last source object and last selection for later use
	rb_cm_lastObject = GetSourceElement(event);
	rb_strLastSelection = (typeof document.selection != "undefined")?document.selection.createRange().text:"";

	if(objMenu.getAttribute("precalculated")) eval(objMenu.getAttribute("precalculated"));
	
	//open the given menu
	positionmenuie5(event, objMenu, align, mynode);
	//build the given menu into menuLvl array
	if(sizeof(menuLvl)==0) menuLvl[1]=objMenu.id;
	if(sizeof(menuLvl)>0){
		if(menuLvl[sizeof(menuLvl)]!==objMenu.id){
			var e=sizeof(menuLvl)+1;
			menuLvl[e]=objMenu.id;
		}
	}
	return false;
}
function close_menus(){
	if(sizeof(menuLvl)>0){
		//close the top level menu
		g(menuLvl[sizeof(menuLvl)]).style.visibility='hidden';
		//unset the array element
		delete_element(menuLvl,sizeof(menuLvl));
	}
}
function positionmenuie5(event, x, align, mynode){
	if(typeof align=='undefined') var align='mouse';
	
	var p=GetAbsolutePosition(mynode);
	var etop=p.y;
	var eleft=p.x;

	switch(true){
		case align.indexOf('mouse')!=-1:
			var align=align.split(',');
			var addtop=(typeof align[1]=='undefined' ? 0 : parseInt(align[1]));
			var addleft=(typeof align[2]=='undefined' ? 0 : parseInt(align[2]));

			var rtedge = document.body.clientWidth-event.clientX;
			var btmedge = document.body.clientHeight-event.clientY;
			if (rtedge < x.offsetWidth){
				x.style.left = (getPageOffset('left') + event.clientX - x.offsetWidth + addleft)+'px';
			}else{
				x.style.left = (getPageOffset('left') + event.clientX + addleft) +'px';
			}
			if (btmedge < x.offsetHeight){
				x.style.top = (getPageOffset('top') + event.clientY - x.offsetHeight + addtop)+'px';
			}else{
				x.style.top = (getPageOffset('top') + event.clientY + addtop)+'px';
			}
		break;
		case align=='topleftalign':
			//width and height of div
			//mynode is global from showmenuie5 -- good enough for now
			x.style.top = (mynode.offsetTop - x.offsetHeight)+'px';
			x.style.left= (mynode.offsetLeft)+'px';
		break;
		case align=='topleftaligndown':
			//width and height of div
			//mynode is global from showmenuie5 -- good enough for now
			//alert(mynode.offsetTop + ':' + x.offsetHeight);
			x.style.top = (mynode.offsetTop)+'px';
			x.style.left= (mynode.offsetLeft)+'px';
		break;
		case align=='bottomleftalign':
			x.style.top=(mynode.offsetHeight+mynode.offsetTop)+'px';
			x.style.left=(mynode.offsetLeft)+'px';
			//width and height of div
			//mynode is global from showmenuie5 -- good enough for now
		break;
	}
	/*
	fademenusin=false;
	if(fademenusin){
		browser=='IE' ? x.style.filter='alpha(opacity=0)' : x.style.opacity='0.00';
	}
	*/
	x.style.visibility = "visible";
	/*
	if(fademenusin){
		fadeobject(x,1,.05);
	}
	*/
}
function fadeobject(o, startfrom, goto, direction, increment){
	if(false){
		g('ly1').style.filter='alpha(opacity=100)';
		g('ly2').style.filter='alpha(opacity=0)';
		g('ly1').style.MozOpacity=1.0;
		g('ly2').style.MozOpacity=0.0;
	}
	
	var b=(broswer=='IE'?'filter':'MozOpacity');
	var at=o.style[b];
	if(typeof at=='undefined'){
		o.style[b]=(browser=='IE'?'alpha(opacity='+(startfrom*100)+')' : startfrom);
		
	}else{
		
	}
	

}
function hidemenuie5(event, lvl) {
	if(override_hidemenuie5)return true;
	if (typeof event == "undefined")	event = window.event;
	//wait... maybe user pressed ALT and click? if so, activate menu:
	if (event.altKey){
		showmenuie5(event, lvl);
		return;
	}
	if(typeof lvl=='undefined') lvl=0;
	//added by Yahav, 28/08/2004 - reason: don't hide menu when clicking disabled menu options of menu line breaks
	if(GetSourceElement(event).disabled || GetSourceElement(event).tagName == "hr") return false;
	// this was a patch
	if(hm_cxl || hm_cxlseq==1){
		hm_cxl=0;
	}else{
		var gx='';
		for(var x in menuLvl){
			if(x>lvl){
				//old method - eval( menuLvl[x]+'.style.visibility="hidden";' );
				g(menuLvl[x]).style.visibility="hidden";
				gx=x+','+gx;
			}
		}
		gx= gx.substring(0,gx.length-1);
		var h=gx.split(',');
		for(var x in h){
			if(h[x]>lvl){
				delete_element(menuLvl,h[x]);
			}
		}
	}
	if(hm_cxlseq>0)hm_cxlseq--;
	if(lvl>0){
			hm_cxl=1;
	}
}
function highlightie5(event) {
	if (typeof event == "undefined")
		event = window.event;
	if(!GetSourceElement(event).getAttribute('disabled')){
		if (GetSourceElement(event).className == "menuitems") {
			GetSourceElement(event).style.backgroundColor = "highlight";
			GetSourceElement(event).style.color = "#FFFFFF";
		}
	}
	if(GetSourceElement(event).getAttribute('status')){
		statusBuffer=window.status;
		window.status=GetSourceElement(event).getAttribute('status');
	}
}
function lowlightie5(event) {
	if (typeof event == "undefined")
		event = window.event;
	if(!GetSourceElement(event).getAttribute("disabled")){
		if (GetSourceElement(event).className == "menuitems") {
			GetSourceElement(event).style.backgroundColor = "";
			GetSourceElement(event).style.color = "#000000";
		}
		window.status = statusBuffer;
	}
}
/* hightlight2 and lowlight2 newly created 2008-02-16 */
function hlght2(event) {
	if (typeof event == "undefined") event = window.event;
	var o=GetSourceElement(event);
	if(o.className.substring(0,9)!=='menuitems') return;
	if(o.className.match(' mndis')){
		o.style.backgroundColor = disabledOptionHighlight;
		o.style.color = disabledOptionHighlightTextColor;
	}else{
		o.style.backgroundColor = optionHighlight;
		o.style.color = optionHighlightTextColor;
	}
	if(o.getAttribute('status')){
		statusBuffer=window.status;
		window.status=o.getAttribute('status');
	}
}
function llght2(event) {
	if (typeof event == "undefined") event = window.event;
	var o=GetSourceElement(event);
	if(o.className.substring(0,9)!=='menuitems') return;
	if(o.className.match(' mndis')){
		o.style.backgroundColor = '';
		o.style.color = disabledOptionTextColor;
	}else{
		o.style.backgroundColor = '';
		o.style.color = "#000";
	}
	window.status = statusBuffer;
}
function executemenuie5(event) {
	if (typeof event == "undefined")
		event = window.event;
	if(!GetSourceElement(event).getAttribute('disabled')){
		if(GetSourceElement(event).getAttribute('command')){
			try{
				eval(GetSourceElement(event).getAttribute('command'));
			}catch(e){
				var strMsg=e.description||e.message;
				alert('Function to execute: '+GetSourceElement(event).getAttribute('command')+'\nError: '+strMsg);
			}
			if(option_hm_cxl==1){
				option_hm_cxl=0;
			}else{
				hidemenuie5(event);
			}
			return false;
		}
	}else{
		//we need to interrupt the closure of the menu
	}
}
function defaultMenuOption(event){
	/*
	2008-03-07
	this is normally assoc. with the double click event on an object with a context menu.  Looks for default="1" (which can be set dynamically by the precalculated= function).  In the process, the event is a double-click, and the source element is the object itself.  When I right-click and then click the default option, the event is a click and the source element is the default option itself.  This must be considered in the coding for the default command function
	
	*/
	var test=false;
	var src=GetSourceElement(event);
	if(!src.id){
		while(true){ /* bubble up until first node with id declared */
			src=src.parentNode;
			if(src.id){
				var id=src.id;
				break;
			}
		}	
	}else{
		id=src.id;
	}
	for(i in rMenuMap){
		eval( 'test=id.match(/'+i+'/);' );
		if(test){
			var wrap=g(rMenuMap[i]);
			for(var j in wrap.childNodes){
				if(wrap.childNodes[j].id && wrap.childNodes[j].getAttribute('default')=='1'){
					eval(wrap.childNodes[j].getAttribute('command'));
					return;
				}
			}
			return;
		}
	}
}









