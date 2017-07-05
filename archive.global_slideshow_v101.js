/**
2007-01-30: reviewed
2005-09-19:
-----------
v101 differs from v100 in that the head vars have been moved here (exc. for the dynamically created ones)
**/

var g2string='';
function g(o){ return document.getElementById(o); }
function g2(x){ g2string+=x+'\n'; }
function toggle_description(){
	if(g('pictureTextHTML').style.display=='block'){
		if(!g('password').value){
			if(!(g('password').value=prompt('Enter your password to edit this (only need to enter once)','')))return;
		}
		g('pictureTextHTML').style.display='none'
		g('pictureTextText').style.display='block';
		try{
			g('Description').focus();
			editing=true;
		}catch(e){  }
	}else{
		g('pictureTextHTML').style.display='block'
		g('pictureTextText').style.display='none';
		//transfer text over
		g('pictureTextHTML').innerHTML=g('Description').value;
	}
}
function loadImagesStats(_idx){
	var inttime=parseFloat(new Date()/1000);
	loadImagesStatsTime= inttime - starttime;
	//failsafe call of fifo after 2 minutes
	if(loadImagesStatsTime > 120000){
		for(var i=1; i<=imgcount; i++){
			!imgs[i].src ? imgs[i].src =srcs[i] : '';
		}
		sscalled=true;
		ss_prep1();
		fifo();
		return;
	}
	if(imgs[_idx].src && imgs[_idx].width>30){
		//image has been loaded
		totalloaded +=fsize[_idx];
		//average speed so far (bytes/second)
		bs=totalloaded/loadImagesStatsTime;
		//remaining files' size to load
		totalleft=showsize-totalloaded;
		//time remaining= totalleft / bytes/second
		tRemaining = totalleft / bs;
		if(((slidetime > tRemaining && loadImagesStatsTime > minstarttime) || (loadImagesStatsTime > maxstarttime)) && !sscalled){
			sscalled=true;
			ss_prep1();
			fifo();
		}
		if( (idx==1 && _idx==imgcount) || (idx>1 && loadImagesStatsTime>0 && idx-_idx==1) ){
			if(!sscalled){
				sscalled=true;
				ss_prep1();
				fifo();
			}
			return;
		}
		_idx >= imgcount ? _idx=1 : _idx++;
	}else	if(!imgs[_idx].src){
		//load image source now
		imgs[_idx].src=srcs[_idx];
	}
	setTimeout('loadImagesStats('+_idx+')',50);
}
function startStop(){
	g('bStartStop').src=(running?'images/assets/start.gif':'images/assets/stop.gif');
	g('bStartStop').setAttribute('title',(!running?'Stop slideshow':'Start slideshow'));
	//g('bStartStop').className=(!running?'redbutton':'greenbutton');
	running=!running;
	if(running && !inDuration)setTimeout('fifo()',inc);
}
function previousNext(s){
	//reset opacities and swap out images
	var idxTo = (idx+s)%imgcount;
	idxTo==0 ? idxTo=imgcount : '';
	var idxToNext = idxTo+1;
	idxToNext>imgcount ? idxToNext=1 : '';
	idxTo=parseInt(idxTo); idxToNext=parseInt(idxToNext);
	g('img1').src=imgs[idxTo].src;
	g('img1').width=fwidth[idxTo];
	g('img1').height=fheight[idxTo];

	if(!editing){
		g('Description').value=(g('description_'+idxTo).innerHTML ? g('description_'+idxTo).innerHTML : g('description_'+idxTo).getAttribute('FileName'));
		g('pictureTextHTML').innerHTML=g('Description').value;
		g('FileName').value=g('description_'+idxTo).getAttribute('FileName');
		g('Idx').value=idxTo;
	}

	if(browser=='IE'){
		g('ly1').style.filter='alpha(opacity=100)';
		g('ly2').style.filter='alpha(opacity=0)';
	}else{
		g('ly1').style.MozOpacity=1.0;
		g('ly2').style.MozOpacity=0.0;
	}
	idx=idxTo;
	idxNext=idxToNext;
	g('img2').src=imgs[idxToNext].src;
	g('img2').width=fwidth[idxToNext];
	g('img2').height=fheight[idxToNext];
}
function fifo(){
	if(inDuration)inDuration=false;
	if(!running)return;
	if(browser=='IE'){
		var f1=parseInt(g('ly1').style.filter.match(opreg));
		var f2=parseInt(g('ly2').style.filter.match(opreg));
	}else{
		var f1=parseInt(g('ly1').style.MozOpacity*100);
		var f2=parseInt(g('ly2').style.MozOpacity*100);
	}
	if(f1>0){
		//fade out f1 by increment
		f1=(f1-diff1>0?f1-diff1:0);
		if(browser=='IE'){
			g('ly1').style.filter='alpha(opacity='+f1+')';
		}else{
			g('ly1').style.MozOpacity=f1/100;
		}
	}
	if(f2<100 && f1<ithreshold){
		//fade in f2 by increment
		f2=(f2+diff2<100?f2+diff2:100)
		if(browser=='IE'){
			g('ly2').style.filter='alpha(opacity='+f2+')';
		}else{
			g('ly2').style.MozOpacity=f2/100;
		}
	}
	if(f1>0 || f2<100){
		setTimeout('fifo()',inc);
	}else{
		//swap images for the next fifo
		g('img1').src=imgs[idxNext].src;
		g('img1').width=fwidth[idxNext];
		g('img1').height=fheight[idxNext];
		//insert text and title for this picture
		if(!editing){
			g('Description').value=(g('description_'+idxNext).innerHTML ? g('description_'+idxNext).innerHTML : g('description_'+idxNext).getAttribute('FileName'));
			g('pictureTextHTML').innerHTML=g('Description').value;
			g('FileName').value=g('description_'+idxNext).getAttribute('FileName');
			g('Idx').value=idxNext;
		}
		if(browser=='IE'){
			g('ly1').style.filter='alpha(opacity=100)';
			g('ly2').style.filter='alpha(opacity=0)';
		}else{
			g('ly1').style.MozOpacity=1.0;
			g('ly2').style.MozOpacity=0.0;
		}
		idx=idxNext;
		srcs.length-1==idx?idxNext=1:idxNext=idx+1;
		g('ly2').style.display='none';
		setTimeout("g('img2').src=imgs[idxNext].src;",500)
		setTimeout("g('img2').width=fwidth[idxNext];",500)
		setTimeout("g('img2').height=fheight[idxNext];",500)
		setTimeout("g('ly2').style.display='block';",500)
		inDuration=true;
		setTimeout('fifo()',duration);
	}
}
function ss_prep1(){
	g('topTextWait').innerHTML='';
}

// ------------------- ROOT VARIABLES NEEDED FOR CALCS AND CONTROLS -----------------
var opreg=/[0-9]+/;
var running=true;
var loadImagesStatsTime=0;

var imgs=new Array();
var srcs=new Array();
var fsize=new Array();
var fwidth=new Array();
var fheight=new Array();

// ------------------ calculate times ----------------------
/***
Typically we're dealing with slideshows of between 20 and 50 images, and they SHOULD be between 60K and 120K.  Median ^> is 35(90) = 3150K.  I'm seeing speeds of only 30Kb per second and I KNOW I have a slow connection.
***/

