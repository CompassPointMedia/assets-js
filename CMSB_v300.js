/*
version 1.1 1/16/2009
upgraded as of 1/16 only to match version for corresp. CMSB function 
CMS Bridge version 1.0 1/1/2009 :)
to do: read the width and current height of the object to be edited, and configure the popup accordingly
*/
var CMSB='CMS Bridge Version 3.0';
if(typeof CMSBEditorURL=='undefined')CMSBEditorURL='/cms3.11.php';
function CMSBedit(o, method, cmssection, found, cnx){
	var loc=window.location+'';
	loc=loc.replace(/#[^#]*$/,'');
	var method=o.getAttribute('method');



	if(cmssection){
		//OK
	}else{
		//fetch the first div or span with an id attribute - that is the region for editing
		if(typeof found=='undefined')found='after';
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

	URL='/'+CMSBEditorURL+'?method='+method;
	if(method=='static:parameters'){
		URL+='&thisfolder='+thisfolder+'&thispage='+thispage+'&thissection='+cmssection;
		URL+='&primaryParameter='+o.getAttribute('primaryParameter');
		URL+='&primaryValue='+escape(o.getAttribute('primaryValue'));
		URL+='&secondaryParameter='+o.getAttribute('secondaryParameter');
		URL+='&secondaryValue='+escape(o.getAttribute('secondaryValue'));
		if(typeof cnx!=='undefined')URL+='&thiscnx='+cnx;

	}else if(method=='static:default'){
		URL+='&thisfolder='+escape(thisfolder)+'&thispage='+escape(thispage)+'&thissection='+escape(cmssection);
		if(l=o.getAttribute('lang'))URL+='&lang='+l;
		if(typeof cnx!=='undefined')URL+='&thiscnx='+cnx;

	}else if(method=='dynamic:simple'){
		URL+='&thissection='+cmssection;
		URL+='&CMSTable='+o.getAttribute('CMSTable');
		URL+='&CMSContentField='+o.getAttribute('CMSContentField');
		URL+='&primaryKeyField='+o.getAttribute('primaryKeyField');
		URL+='&primaryKeyFieldLabel='+o.getAttribute('primaryKeyFieldLabel');
		if(o.getAttribute('primaryKeyValue'))URL+='&primaryKeyValue='+o.getAttribute('primaryKeyValue');
		URL+='&URL='+escape(loc);
		if(typeof cnx!=='undefined')URL+='&thiscnx='+cnx;
	}
	if(o.getAttribute('commonfolder'))URL+='&commonfolder='+o.getAttribute('commonfolder');
	if(o.getAttribute('commonpage'))URL+='&commonpage='+o.getAttribute('commonpage');
	
	//we need logic on the window name, if the window has edited content on it, and how big the window should be
	var w=0; var wx=0;
	if(g(cmssection)){
		if(wx=g(cmssection).offsetWidth){
			if(wx>340 && wx < 640)w=wx+60;
		}
	}
	if(!w)w=875;
	if(w<875)w=875;
	ow(URL.replace('//','/'),'l1_cms',w+',700');
	return false;
}
function CMSBEditFromContent(o,evt){
	if(!evt.ctrlKey)return false;
	var oa=g('CMSB-'+o.getAttribute('id'));
	CMSBedit(oa, oa.getAttribute('method'), o.getAttribute('id'));
}