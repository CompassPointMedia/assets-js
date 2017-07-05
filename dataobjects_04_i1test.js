/*
	E-commerce site version 4.0.0
	-----------------------------
	note: parameter evt is 1 for oncontextmenu, 0 otherwise
	2009-08-05: modified function h() (finally) so that classnames may be applied - you must declare hl_baseclass[grp] and hl_class[grp]
*/
var _DATAOBJECTS_VERSION_=4.00;
var _DATAOBJECTS_INSTANCE=1;

var setCtrl=false;
var hl_grp=new Array();
var sel_id=new Array();
var ogrp=new Array();
var hl_bg=new Array();
var hl_txt=new Array();
var hl_class=new Array();
var hl_baseclass=new Array();
var cxl_hlt=0;


function h(x, grp, multi, evt, event){
	if (typeof event == "undefined")
		event = window.event;
	if(cxl_hlt==1){cxl_hlt=0;return false;}
	if(typeof grp=='undefined')grp=1;
	if(typeof multi=='undefined')multi=0;
	if(typeof evt=='undefined')evt='';
	try{document.selection.empty();} catch(e){
		if(e.description){ alert('File: dataobjects_i1_v200.js\nLine: 26\n'+e.description);}
	}
	var eck=false;
	//solves a problem: JS says event is an object, but event.ctrlKey in some cases kills the script
	try{ var eck=event.ctrlKey; }catch(e2){ if(e2.description){ eck=false; }	}
	if(multi && ((typeof event !=='undefined' && eck) || setCtrl==true) ){ //only works in explorer currently - however setCtrl will simulate ctrlKey 
		//control key pressed
		if(in_array(x.id, hl_grp[grp], 11)){
			//the item is already in the array, revert its color and unset it
			if(hl_class[grp]){
				var cn=x.className;
				x.className=cn.replace(hl_class[grp],hl_baseclass[grp]);
			}else{
				x.style.backgroundColor=hl_grp[grp][x.id]['bg'];
				x.style.color=hl_grp[grp][x.id]['color'];
			}
			unset(x.id, 'hl_grp["'+grp+'"]');
		}else{
			//change its color, add to the array and indicate the "last selected" item
			var bg=(hl_bg[grp]?hl_bg[grp]:'highlight');
			var txt=(hl_txt[grp]?hl_txt[grp]:'#FFF');
			if (hl_grp[grp]){
				hl_grp[grp][x.id]=x;
				if(hl_class[grp]){
					//no need to store
				}else{
					hl_grp[grp][x.id]['bg']=x.style.backgroundColor;
					hl_grp[grp][x.id]['color']=x.style.color;
				}
			}
			if(x){
				if(hl_class[grp]){
					var cn=x.className;
					x.className=cn.replace(hl_baseclass[grp],hl_class[grp]);
				}else{
					x.style.backgroundColor=bg;
					x.style.color=txt;
				}
			}
		}
	}else{
		//return if right-clicking over an existing hightlighted item
		for(j in hl_grp[grp]){
			if(j==x.id && evt==1)return;
		}
		alert(4);
		//revert all elements in the array
		try{
		for(var i in hl_grp[grp]){
			if(hl_class[grp]){
				var cn=g(i).className;
				g(i).className=cn.replace(hl_class[grp],hl_baseclass[grp]);
			}else{
				g(i).style.backgroundColor=hl_grp[grp][i]['bg'];
				g(i).style.color=hl_grp[grp][i]['color'];
			}
		}

		//unset the array
		var bg=(hl_bg[grp]?hl_bg[grp]:'highlight');
		var txt=(hl_txt[grp]?hl_txt[grp]:'#FFF');
		hl_grp[grp]=new Array;
		//reset this item in the array
		hl_grp[grp][x.id]=x;
		hl_grp[grp][x.id]['bg']=x.style.backgroundColor;
		hl_grp[grp][x.id]['color']=x.style.color;
		//change color
		if(hl_class[grp]){
			var cn=x.className;
			x.className=(cn?cn.replace(hl_baseclass[grp],hl_class[grp]):hl_class[grp]);
		}else{
			x.style.backgroundColor=bg;
			x.style.color=txt;
		}
		//legacy code - find instances of and delete
		sel_id[grp]=x;
		//lastSelectedID[grp]=x.id;

		}catch(e){ }
	}
}
function dataobjects_config(grp,col,hlg){
	//this passes information on the currently selected item in the group
	if(typeof hlg=='undefined'){var hlg=1;}
	var append='';
	if(typeof sel_id[hlg].id!=='undefined'){
		//controls re-select of highlight
		append='&ogrp['+grp+'][select]='+sel_id[hlg].id;
	}
	document.selection.empty();
	if(typeof ogrp[grp]=='undefined')return;
	gotMatch=false;
	//split existing sort by ','
	ogrp[grp]['sort']=""+ogrp[grp]['sort'];
	cols=ogrp[grp]['sort'].split(',');
	if( event.shiftKey ){
		for(var x in cols){
			cols[x]=parseInt(cols[x]);
			if(Math.abs(cols[x])==col)gotMatch=true;
		}
		if(gotMatch){
			if( Math.abs(cols[0])==col ){
				//change the global var and return the new string
				//change x,y,z => -x,y,z *OR* -x,y,z => x,y,z
				cols[0]=cols[0]*-1;
				var x=cols.join(',');
				ogrp[grp]['sort']=x;
				return x+""+append;
			}else{
				//if y you'd get x,y,z => x,z
				//put it on the front, i.e.:  x,y,z => y,x,z
				var buffer=new Array();
				//remove it from the string ( y for example)
				buffer[0]=col;
				bkey=1;
				for(var x in cols){
					if(Math.abs(cols[x])!==col){buffer[bkey]=cols[x];bkey++;}
					if(bkey>2)break;
				}
				var x=buffer.join(',');
				ogrp[grp]['sort']=x;
				return x+""+append;
			}
		}else{
			//remove the last element: x,y,z => y,z
			//add the new element: w,y,z
			var x=col;
			if(typeof cols[0]!='undefined')x+=','+cols[0];
			if(typeof cols[1]!='undefined')x+=','+cols[1];
			ogrp[grp]['sort']=x;
			return x+""+append;
		}
	}
	//non-shift key
	var x=parseInt(ogrp[grp]['sort']);
	if(Math.abs(x)==col){
		ogrp[grp]['sort']=(x*-1);
		return (x*-1)+""+append;
	}
	//otherwise return col
	ogrp[grp]['sort']=col;
	return col+""+append;
}
function refresh_list(handle, version, params, cb, tgt){
	//latest greatest version of this function 12-04-2005, master copy
	if(typeof handle=='undefined')return false;
	if(typeof version=='undefined')version='124';
	if(typeof params=='undefined')params='';
	if(typeof cb=='undefined') cb='';
	if(typeof tgt=='undefined') tgt='w0';
	var sel='';
	var url='/client/admin/util/objects_v'+version+'.php?Handle='+handle+(params?'&'+params:'')+(cb?'&callbackfunction='+escape(cb):'');
	try{
		//current sort
		if(x = ogrp[handle]['sort'])url+='&ogrp['+handle+'][sort]='+x;
		//get selected item(s)
		for(var j in hl_grp[ogrp[handle]['rowId']])sel+=j+','
		if(sel)url+='&ogrp['+handle+'][select]='+x;
	}
	catch(e){
		if(e.description && false)alert('repair function refresh_list: '+e.description);
	}
	//alert(url);
	window.open(url,tgt);
}
function toggleActive(component,current){
	if(typeof toggleActiveURL=='undefined')toggleActiveURL='resources/bais_01_exe.php';
	window.open(toggleActiveURL+'?mode=refreshComponent&component='+component+'&hideInactive='+(current?0:1),'w2');	
}
function toggleActiveObject(component,node,datasetComponent){ //component|dataset=Member, datasetComponent=listMembers
	if(typeof toggleActiveURL=='undefined')toggleActiveURL='resources/bais_01_exe.php';
	if(typeof toggleActiveComponentName=='undefined')toggleActiveComponentName='component';
	var active=g('r_'+node).getAttribute('active');
	window.open(toggleActiveURL+'?mode=toggleActiveObject&component='+component+'&datasetComponent='+(typeof datasetComponent!='undefined'?datasetComponent:'')+'&node='+node+'&current='+active, 'w2');
}
function datasetSort(component,col,e,f,k){
	if(typeof e== "undefined")e=window.event;
	sortCtrl=0;sortShift=0;sortAlt=0;
	if(e.ctrlKey)sortCtrl=1;
	if(e.shiftKey)sortShift=1;
	if(e.altKey)sortAlt=1;
	window.open('resources/bais_01_exe.php?mode=refreshComponent&component='+component+'&sort='+col+'&sortAlt='+sortAlt+'&sortCtrl='+sortCtrl+'&sortShift='+sortShift+'&componentFile='+f+'&componentKey='+k,'w2');
	return false;
}
