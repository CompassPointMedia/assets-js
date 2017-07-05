/*
CMS Bridge version 1.0 1/1/2009 :)
to do: read the width and current height of the object to be edited, and configure the popup accordingly
*/
var CMSB='CMS Bridge Version 1.0';
if(typeof CMSBEditorURL=='undefined')CMSBEditorURL=(thispage=='fcktest.php'?'/cms2.1.test.php':'/cms2.1.php');
function CMSBedit(o, method, cmssection, found){
	if(typeof found=='undefined')found='after';
	var loc=window.location+'';
	loc=loc.replace(/#[^#]*$/,'');
	var method=o.getAttribute('method');



	if(cmssection){
		//OK
	}else{
		//fetch the first div or span with an id attribute - that is the region for editing
		var reach=0;
		while(true){
			reach++;
			o=(found=='after' ? o.nextSibling : o.previousSibling);
			if(o.getAttribute){
				if(cmssection=o.getAttribute('id')){
					break;
				}
			}
			if(reach>5)return false; //edit button must be placed closely to the 
		}
	}
	if(!cmssection)return false;

	URL=CMSBEditorURL+'?method='+method;
	if(method=='static:default'){
		URL+='&thisfolder='+thisfolder+'&thispage='+thispage+'&thissection='+cmssection;
	}else if(method=='dynamic:simple'){
		URL+='&thissection='+cmssection;
		URL+='&CMSTable='+o.getAttribute('CMSTable');
		URL+='&CMSContentField='+o.getAttribute('CMSContentField');
		URL+='&primaryKeyField='+o.getAttribute('primaryKeyField');
		URL+='&primaryKeyFieldLabel='+o.getAttribute('primaryKeyFieldLabel');
		if(o.getAttribute('primaryKeyValue'))URL+='&primaryKeyValue='+o.getAttribute('primaryKeyValue');
		URL+='&URL='+escape(loc);
	}
	//we need logic on the window name, if the window has edited content on it, and how big the window should be
	ow(URL,'l1_cms','950,750');
	return false;
}
function CMSBEditFromContent(o,evt){
	if(!evt.ctrlKey)return false;
	var oa=g('CMSB-'+o.getAttribute('id'));
	CMSBedit(oa, oa.getAttribute('method'), o.getAttribute('id'));
}