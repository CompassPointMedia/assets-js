/************************************************************************************************************

Ajax dynamic list
Copyright (C) 2006  DTHMLGoodies.com, Alf Magne Kalleland
Alf Magne Kalleland, April 2006
Owner of DHTMLgoodies.com

* 2012-11-26:
Instances: 
admin/file_explorer/leftnav.php - this was the first use.  Note the overrides of functions and variables declared - IT'S STILL A MESS WITH THE ABSTRACTION!
console/report_items_changeable.php - second use.  First use of non-tags means a) no building a cancellable tag list b) we either DON'T blank out a fulfilled value, or correct a shortined or non-case-correct value.  Also, note a very important set of coding (which is really easier for updating) under $('.autofill').blur(); the key here lies in when blur happens vs keyup

TODO
	* DONE	re-set up the add new feature
	* DONE	adding from list does a bindTo - this is a dynamic pre-function option
	* DONE	removing is also dynamic
	* DONE	change the c_111 to c_111_222 in this case
	* DONE	test for both tab, enter, and click for all actions
	* have the box size-to the number of options
	* see mode=tag in exe file - what was that?

	* (b) do we or do we not update a value - in a subtable environment, this might not be the best thing to do

* 2012-11-04: turned over to /Library/js/lookup-1.0.js along with declared lookup-1.0.css file

INSTRUCTIONS:
basically you need a non-db input field with a class of autofill, you need a hidden field after it and, if you are doing multiple (array) values, you need a <span> before it to show the tags (similar to emails on hotmail or google)
It is good to have the non-db input field name be random - this keeps browser auto-filling from getting in the way
You can wrap the whole thing in a div but it's not necessary

then you need to declare this array:
var autofills={
	items:{
		mode:'getContactsByLettersV2',			//where the query is located 
		label:'FullName',						//associative field name of return
		table:'finan_items',
		field:'FirstName',
		addNewTag:function(o){},				//this adds the new tag for multiple
		preBuildFunction:function(o){}			//this update the database "live" like google spreadsheets :)
	}
}

you can do a single autofill field or multiples as part of a group.  You can do multiple groups but each separate group needs a separate class in the className defined in the autofills object above.

TODO:
* have the customizable functions more modular
* have the query string for post more modular
* ability to add an item




************************************************************************************************************/
var ajaxBox_offsetX = 0;
var ajaxBox_offsetY = 0;
if(typeof lookup_externalFile=='undefined')var lookup_externalFile = 'resources/bais_01_exe.php';	// Path to external file
if(typeof optionDivInnerHTML=='undefined')var optionDivInnerHTML='sf_optionDivInnerHTML';

var minimumLettersBeforeLookup = 1;	// Number of letters entered before a lookup is performed.

var lookup_debug=1;
var lookup_objects = new Array();
var lookup_cachedLists = new Array();
var lookup_activeInput = false;
var lookup_activeItem;
var lookup_optionDivFirstItem = false;
var lookup_currentLetters = new Array();
var lookup_MSIE = false;
var ajax_optionDiv = false;
var ajax_optionDiv_iframe = false;

//new settings starting 2010-12-24
if(typeof lookup_tab_key_populates=='undefined') var lookup_tab_key_populates=true;
if(typeof lookup_setValue_function=='undefined') var lookup_setValue_function='lookup_setValue';
if(typeof lookup_CSS=='undefined')lookup_CSS='/Library/css/lookup-1.0.css';

if(navigator.userAgent.indexOf('MSIE')>=0 && navigator.userAgent.indexOf('Opera')<0)lookup_MSIE=true;

var currentListIndex = 0;

if(lookup_CSS!==false){
	document.write('<link rel="stylesheet" type="text/css" href="'+lookup_CSS+'" />');
}

//var lookup_tab_key_populates=false;
function lookup_setValue(e,inputObj){
	/*
	2012-11-04: this has been modified from the original coding taken from G reatLoc ations;
	* handles both multiple and single tags or values with a visual method
	*/
	say('setvalue native');
	if(!inputObj)inputObj=this; //"THIS" means the element the onclick is bound to - sweet and easy

	var ID=inputObj.id;
	var Label=inputObj.innerHTML;
	Label=Label.replace('<br','|||');
	Label=Label.split('|||')[0];
	Label=Label.replace('<span class="highlighted">','');
	Label=Label.replace('</span>','');

	if($(optionRootElement).next().val().indexOf('|'+ID+'|')>-1){
		//they have already selected this element
	}else{
		//----------- execute the pre-function if present ---------------------
		var c=optionRootElement.className.replace(/autofill\s*/,'').split(' ');
		for(var i in c){
			try{
			if(o=autofills[c[i]])o.preBuildFunction(optionRootElement, inputObj);
			}catch(e){ }
		}


		if(lookup_method=='multiple'){
			//add the element visually
			var str='<div id="c'+(optionRootElement.id ? '_'+optionRootElement.id.replace(/[^0-9]/g,'') : '')+'_'+ID+'" class="cancellableItem">';
			str+=Label+'<div class="cancel" onclick="lookupCancel(this)">x</div>';
			str+='</div>';
			$(optionRootElement).prev().html($(optionRootElement).prev().html()+str);
		}
		$(optionRootElement).next().val(
			(lookup_method=='multiple' ? $(optionRootElement).next().val() : '|') +ID+'|'
		);
	}
	

	//hide the list
	lookup_hide();
			
	//clear the input and focus again on it
	if(lookup_method=='multiple'){
		$(optionRootElement).val('');
		$(optionRootElement).focus();
	}else{
		//fill the input box with the full element name
		//could we maybe make this a little longer and more drawn out? :)
		try{
		$(optionRootElement).val(lookup_cachedLists[optionRootElement.appended.mode][$(optionRootElement).val().toLowerCase()][ID][optionRootElement.appended.label]);
		}catch(e){ say(stringify(e)); }
		return false;
	}
}
function lookupAddPrepare(){
	//prepares form and sets focus
	if(!$(optionRootElement).val())return;
	var fn,ln;
	var e=$(optionRootElement).val().split(' ');
	if(e.length==2){
		fn=e[0];
		ln=e[1];
	}else if(e.length==1){
		fn=e[0];
	}
	
	//open up the addition box
	try{
	g('addContact').style.visibility='visible';
	g('FirstName').value=(typeof fn=='undefined'?'':fn);
	g('LastName').value=(typeof ln=='undefined'?'':ln);
	g('personName').innerHTML=(typeof fn!=='undefined' || typeof ln!=='undefined' ? ', ':'')+(typeof fn!=='undefined' ? fn : '')+' '+(typeof ln!=='undefined' ? ln : '');
	g('FirstName').focus();
	} catch(e){ }
	
	//lookup_hide();
}
function itemAddCancel(){
	//close and clear form
	$(optionRootElement).val(''); 
	g('addContact').style.visibility='hidden';
	
	//specifics of this form
	try{
	for(i in {'FirstName':1,'LastName':2,'MiddleName':3,'HomeAddress':4,'HomeCity':5,'HomeZip':6,'HomeMobile':7,'HomePhone':8})g(i).value='';
	g('HomeState').selectedIndex=0;
	g('personName').innerHTML=' ';
	$(optionRootElement).focus();
	}catch(e){ } 
	return false;
}
function lookupCancel(o){
	//removes element from visual list and from key receipt field
	var reg=/c_[0-9]/
	var el=getParentMatching(o,reg);
	g(keyStorageField).value=g(keyStorageField).value.replace('|'+el.id.replace('c_','')+'|','|');
	el.style.display='none';
	$(optionRootElement).focus();
}
function itemAdd(o){
	//submits new item
	var buffer1=g('mode').value;
	var buffer2=g('submode').value;
	g('mode').value='QuickAddContact';
	g('submode').value='populatelookupList';
	g('form1').submit();
	g('mode').value=buffer1;
	g('submode').value=buffer2;
	return false;
}
function sf_optionDivInnerHTML(it,letters){
	/* 2010-12-25 0=id, 1=name, 2=homecity, 3=state, 4=phone */
	var str;
	
	for(var i in it)it[i]=$.trim(it[i]);
	eval('var reg=/(^| )('+letters+')/gi;');
	str=it['FullName'].replace(reg,'<span class="highlighted">$2</span>');
	if(it['City'] || it['State'] || it['Phone'])str+='<br />';	
	str+=it['City']+(it['City'].length || it['State'].length?', ':'')+it['State'];
	str+=(it['Phone'] ? '&nbsp;&nbsp;'+it['Phone'] : '');
	return str;
}

function ajax_getTopPos(inputObj){
	var returnValue = inputObj.offsetTop;
	while((inputObj = inputObj.offsetParent) != null){
	returnValue += inputObj.offsetTop;
  }
  return returnValue;
}
function lookup_cancelEvent(){ return false; }

function ajax_getLeftPos(inputObj){
  var returnValue = inputObj.offsetLeft;
  while((inputObj = inputObj.offsetParent) != null)returnValue += inputObj.offsetLeft;

  return returnValue;
}

function lookup_hide(){
	if(ajax_optionDiv)ajax_optionDiv.style.display='none';
	if(ajax_optionDiv_iframe)ajax_optionDiv_iframe.style.display='none';
}

function ajax_options_rollOverActiveItem(item,fromKeyBoard){
	if(lookup_activeItem)lookup_activeItem.className='optionDiv';
	item.className='optionDivSelected';
	lookup_activeItem = item;
	if(fromKeyBoard){
		if(lookup_activeItem.offsetTop>ajax_optionDiv.offsetHeight){
			ajax_optionDiv.scrollTop = lookup_activeItem.offsetTop - ajax_optionDiv.offsetHeight + lookup_activeItem.offsetHeight + 2 ;
		}
		if(lookup_activeItem.offsetTop<ajax_optionDiv.scrollTop)
		{
			ajax_optionDiv.scrollTop = 0;
		}
	}
}

function ajax_showOptions(inputObj,e){
	/* we need toLowerCase() on some of these array keys! */
	if(inputObj.value.length<2){
		lookup_hide();
		return;
	}
	if(e.keyCode==40 || e.keyCode==38)return;
	if(e.keyCode==13 || e.keyCode==9)return;
	/*
	NOT SURE NEEDED
	if(lookup_currentLetters[inputObj.name]==inputObj.value.toLowerCase())return;
	*/

	paramToExternalFile=inputObj.appended.mode;

	//this carries the input element object to other functions
	optionRootElement=inputObj;
	
	/*
	optionRootElement=$(inputObj);
	optionRootElement.appended=inputObj.appended;
	*/
	
	if(!lookup_cachedLists[paramToExternalFile])lookup_cachedLists[paramToExternalFile] = new Array();
	lookup_currentLetters[inputObj.name] = inputObj.value.toLowerCase();
	if(!ajax_optionDiv){
		/* 2012-11-03 here is where jquery would be much better in preventing conflicts of events */
		ajax_optionDiv = document.createElement('DIV');
		ajax_optionDiv.id = 'ajxlistOfOptions';
		document.body.appendChild(ajax_optionDiv);

		if(lookup_MSIE){
			ajax_optionDiv_iframe = document.createElement('IFRAME');
			ajax_optionDiv_iframe.border='0';
			ajax_optionDiv_iframe.style.width = ajax_optionDiv.clientWidth + 'px';
			ajax_optionDiv_iframe.style.height = ajax_optionDiv.clientHeight + 'px';
			ajax_optionDiv_iframe.id = 'ajxlistOfOptions_iframe';

			document.body.appendChild(ajax_optionDiv_iframe);
		}

		var allInputs = document.getElementsByTagName('INPUT');
		for(var no=0;no<allInputs.length;no++){
			if(!allInputs[no].onkeyup)allInputs[no].onfocus = lookup_hide;
		}
		var allSelects = document.getElementsByTagName('SELECT');
		for(var no=0;no<allSelects.length;no++){
			allSelects[no].onfocus = lookup_hide;
		}
		var oldonkeydown=document.body.onkeydown;
		if(typeof oldonkeydown!='function'){
			document.body.onkeydown=ajax_option_keyNavigation;
		}else{
			document.body.onkeydown=function(){
				oldonkeydown();
			ajax_option_keyNavigation() ;}
		}
		var oldonresize=document.body.onresize;
		if(typeof oldonresize!='function'){
			document.body.onresize=function() {ajax_option_resize(inputObj); };
		}else{
			document.body.onresize=function(){oldonresize();
			ajax_option_resize(inputObj) ;}
		}
	}
	if(inputObj.value.length<minimumLettersBeforeLookup){
		lookup_hide();
		return;
	}


	ajax_optionDiv.style.top = (ajax_getTopPos(inputObj) + inputObj.offsetHeight + ajaxBox_offsetY) + 'px';
	ajax_optionDiv.style.left = (ajax_getLeftPos(inputObj) + ajaxBox_offsetX) + 'px';
	if(ajax_optionDiv_iframe){
		ajax_optionDiv_iframe.style.left = ajax_optionDiv.style.left;
		ajax_optionDiv_iframe.style.top = ajax_optionDiv.style.top;
	}

	lookup_activeInput = inputObj;

	ajax_optionDiv.onselectstart =  lookup_cancelEvent;
	currentListIndex++;
	var letters = inputObj.value.toLowerCase();
	if(lookup_cachedLists[paramToExternalFile][letters]){
		ajax_option_list_buildList(letters,paramToExternalFile,currentListIndex);
	}else{
		/*
		var tmpIndex=currentListIndex/1;
		ajax_optionDiv.innerHTML = '';
		var ajaxIndex = lookup_objects.length;
		lookup_objects[ajaxIndex] = new sack();
		var url = lookup_externalFile + '?suppressPrintEnv=1&mode=listBuilder&submode=' + paramToExternalFile + '&letters=' + inputObj.value.replace(" ","+");
		lookup_objects[ajaxIndex].requestFile = url;	// Specifying which file to get
		lookup_objects[ajaxIndex].onCompletion = function(){ ajax_option_list_showContent(ajaxIndex,inputObj,paramToExternalFile,tmpIndex); };	// Specify function that will be executed after file has been found
		lookup_objects[ajaxIndex].runAJAX();		// Execute AJAX function
		*/


		//----------- new coding -----------	
		$.post(lookup_externalFile + '?suppressPrintEnv=1&mode=listBuilder&submode=' + paramToExternalFile + '&letters=' + letters.replace(" ","+"), function(data) {
			_d_=data;
		});

		$(document).ajaxStop(function() {
			//this is asynchronous
			lookup_cachedLists[paramToExternalFile][letters]=$.parseJSON(_d_);

			//this line left over from ajax_option_list_showContent() and not fully understood
			if(currentListIndex/1!=currentListIndex){
				return;
			}
			ajax_option_list_buildList(letters,paramToExternalFile);
			$(this).unbind('ajaxStop');
		});
	}
}

function ajax_option_list_buildList(letters,paramToExternalFile){
	ajax_optionDiv.innerHTML = '';
	lookup_activeItem = false;
	if(lookup_cachedLists[paramToExternalFile][letters]==null || lookup_cachedLists[paramToExternalFile][letters].length<=1){
		lookup_hide();
		return;
	}
	lookup_optionDivFirstItem = false;
	var optionsAdded = false;
	
	for(var i in lookup_cachedLists[paramToExternalFile][letters]){
		//legacy, doesn't work but is it necessary for blanks in some way?
		//if(lookup_cachedLists[paramToExternalFile][letters.toLowerCase()][no].length==0)continue;
		optionsAdded = true;
		var div = document.createElement('DIV');
		if(lookup_activeInput.value == lookup_cachedLists[paramToExternalFile][letters][i]['ID'] /*
		   not used any more, I think this means "only one item and it equals this" (since you could have more than one)
		   lookup_cachedLists[paramToExternalFile][letters.toLowerCase()].length==1
		   */){
			lookup_hide();
			return;
		}
		

		eval('div.innerHTML = '+optionDivInnerHTML+'(lookup_cachedLists[paramToExternalFile][letters][i],letters);');
		div.id = i;
		div.className='optionDiv';
		div.onmouseover = function(){ ajax_options_rollOverActiveItem(this,false) }
		eval('div.onclick = '+lookup_setValue_function+';');
		if(!lookup_optionDivFirstItem)lookup_optionDivFirstItem = div;
		ajax_optionDiv.appendChild(div);
	}
	if(optionsAdded){
		ajax_optionDiv.style.display='block';
		if(ajax_optionDiv_iframe)ajax_optionDiv_iframe.style.display='';
		ajax_options_rollOverActiveItem(lookup_optionDivFirstItem,true);
	}else{
	}
	return;
}

function ajax_option_resize(inputObj){
	ajax_optionDiv.style.top = (ajax_getTopPos(inputObj) + inputObj.offsetHeight + ajaxBox_offsetY) + 'px';
	ajax_optionDiv.style.left = (ajax_getLeftPos(inputObj) + ajaxBox_offsetX) + 'px';
	if(ajax_optionDiv_iframe){
		ajax_optionDiv_iframe.style.left = ajax_optionDiv.style.left;
		ajax_optionDiv_iframe.style.top = ajax_optionDiv.style.top;
	}
}

function ajax_option_keyNavigation(e){
	if(document.all)e = event;
	var o;
	if(!ajax_optionDiv || ajax_optionDiv.style.display=='none'){
		if(e.keyCode==9 || e.keyCode==13){
			if(autofill_current){
				/*
				docuent.addingNew=true
				I want to call several methods:
					in-page div to add this
					submit the value I give
					popup add
				*/
				var c=autofill_current.className.replace(/autofill\s*/,'').split(' ');
				for(var i in c){
					if(o=autofills[c[i]])o.addNewTag(autofill_current);
				}
				autofill_current='';
				if(e.keyCode==13)return false;
			}
		}
		return;
	}

	if(e.keyCode==38){	// Up arrow
		if(!lookup_activeItem)return;
		if(lookup_activeItem && !lookup_activeItem.previousSibling)return;
		ajax_options_rollOverActiveItem(lookup_activeItem.previousSibling,true);
	}

	if(e.keyCode==40){	// Down arrow
		if(!lookup_activeItem){
			ajax_options_rollOverActiveItem(lookup_optionDivFirstItem,true);
		}else{
			if(!lookup_activeItem.nextSibling)return;
			ajax_options_rollOverActiveItem(lookup_activeItem.nextSibling,true);
		}
	}

	if(e.keyCode==13 || (lookup_tab_key_populates && e.keyCode==9)){	// Enter key or tab key
		if(lookup_activeItem && lookup_activeItem.className=='optionDivSelected') eval(lookup_setValue_function+'(false,lookup_activeItem);');
		if(e.keyCode==13){
			return false; 
		}else{
			return true;
		}
	}
	if(e.keyCode==27){	// Escape key
		lookup_hide();
	}
}

document.documentElement.onclick = autoHideList;
function autoHideList(e){
	if(document.all)e = event;
	if (e.target) source = e.target;
		else if (e.srcElement) source = e.srcElement;
		if (source.nodeType == 3) // defeat Safari bug
			source = source.parentNode;
	if(source.tagName.toLowerCase()!='input' && source.tagName.toLowerCase()!='textarea')lookup_hide();
}
var autofill_current;
$(document).ready(function(){
	$('.autofill').keyup(function(e){
		if(!this.appended){
			var a=this.className.replace(/autofill/,'').split(/\s+/);
			for(var i=0;i<a.length;i++) if(typeof autofills[a[i]]=='object'){
				this.appended=autofills[a[i]];
			}
		}
		ajax_showOptions(this,e)
	});
	$('.autofill').focus(function(e){
		autofill_current=this;
		autofill_current.focusValue=this.value;
	});
});