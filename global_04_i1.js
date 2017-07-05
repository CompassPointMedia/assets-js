/*
	E-commerce site version 4.0.0
	-----------------------------
	2009-02-21: arrays for driver
*/
var _GLOBALS_VERSION_=4.00;
var _GLOBALS_INSTANCE=1;

//helpful info about environment
var hostName=window.location.hostname;
var secureProtocol=(window.location.protocol=='https:'?true:false);

//these are the windows that this page has opened
var wins=new Array();
//opposites
var op=new Array();
op['block']='none';
op['none']='block';
op['visible']='hidden';
op['hidden']='visible';
op['menu']='highlight';
op['highlight']='menu';

var wo=window.opener;
var wp=window.parent;
var open_a='<a ';
var open_a_end='">';
var close_a='</a>';
var leftbracket='<';
var rightbracket='>';

var canada = new Array('AB','BC','MB','NB','NF','NS','NT','ON','PE','PQ','QC','SK','YT');
var labels= new Array();
var timelapse =[];
var timelapse_inprocess=[];
var timelapse_interval=[];
