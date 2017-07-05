//-----------------------------------------------------------------------------------
//DateBox_v1.js: common date text box functions. bind text box to events and perform various operations.
//CREATED: 10/30/2004 by Yahav
//LAST EDIT DATE:
//-----------------------------------------------------------------------------------

	/* NOTE: THIS FILE MUST BE INCLUDED AFTER /Library/js/common/common_i1_v100.js FILE!*/
	
	//define command:
	var strCommand="var arrInputs=document.getElementsByTagName(\"input\"); for (var i=0; i<arrInputs.length; i++) "+
		"if ((arrInputs[i].type == \"text\")&&(arrInputs[i].attributes[\"date_box\"])&&"+
		"(arrInputs[i].attributes[\"date_box\"].value == \"1\")) {arrInputs[i].onkeypress=DateBoxKeypress; "+
		"arrInputs[i].onblur=DateBoxBlur; arrInputs[i].onkeydown=DateBoxKeydown;}";
	//verify that common file was included:
	if (typeof _LOADER_VERSION_ == "undefined")
	{
		window.onload=function WinOnLoad()
		{
			eval(strCommand);
		}
	}else{
		//first of all, add the vital commands to the global onload event:
		AddOnloadCommand(strCommand);
	}
	
	//define globals:
	var BREAK_POINT=61;	//dates like 61-99 will become 1961-1999, dates like 00-60 will become 2000-2060

	function DateBoxKeypress(evt)
	{
		if(typeof evt == "undefined") evt= window.event;
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//current supported keys:
		//t = Todays date (e.g. 10/27/2004)
		//+ or "=" = Advances date by 1 day (10/28/2004, 10/29/2004, 10/30/2004, etc.) each time you press
		//- = Decreases date by 1 day (10/26/2004, 10/25/2004, 10/24/2004)
		//w = moves to previous monday each time you press (10/25/2004, 10/18/2004, 10/11/2004)
		//k = moves to end of week (sunday) each time (10/31/2004, 11/06/2004, 11/13/2004)
		//m = to beginning of month each time, i.e. 10/1/2004, 9/1/2004, 8/1/2004
		//h = to end of month each time 10/31/2004, 11/30/2004, 12/31/2004
		//y = to beginning of year each time
		//r = to end of year each time
		var action=true;
		/*
		var j=0;
		for(i in evt){
			alert(i + ' : ' + evt[i]);
			j++;
			if(j>75)return false;
			}
		return false;*/
		var obj=(evt.srcElement ? evt.srcElement : evt.target);
		var k=(evt.keyCode ? evt.keyCode : evt.charCode);
		switch (k)
		{
			case "T".charCodeAt(0):
			case "t".charCodeAt(0):
				action = PutCurrentDate(evt); break;
			case "+".charCodeAt(0):
			case "=".charCodeAt(0):
				action = PutTommorow(evt); break;
			case "-".charCodeAt(0):
				action = PutYesterday(evt); break;
			case "W".charCodeAt(0):
			case "w".charCodeAt(0):
				action = PutPreviousMonday(evt); break;
			case "K".charCodeAt(0):
			case "k".charCodeAt(0):
				action = PutNextSunday(evt); break;
			case "M".charCodeAt(0):
			case "m".charCodeAt(0):
				action = PutMonthBegin(evt); break;
			case "H".charCodeAt(0):
			case "h".charCodeAt(0):
				action = PutMonthEnd(evt); break;
			case "Y".charCodeAt(0):
			case "y".charCodeAt(0):
				action = PutYearBegin(evt); break;
			case "R".charCodeAt(0):
			case "r".charCodeAt(0):
				action = PutYearEnd(evt); break;
		}
		if (action == false)
			obj.select();
		return action;
	}
	function DateBoxKeydown(evt)
	{
		if(typeof evt == "undefined") evt = window.event;
		//---- version 1.0, by Yahav, last edit 2004-11-08
		//current supported keys:
		//arrow up (ascii 38) = Advances date by 1 day (10/28/2004, 10/29/2004, 10/30/2004, etc.) each time you press
		//arrow down (ascii 40) = Decreases date by 1 day (10/26/2004, 10/25/2004, 10/24/2004)
		var action=true;
		var obj=(evt.srcElement ? evt.srcElement : evt.target);
		var k=(evt.keyCode ? evt.keyCode : evt.charCode);
		switch (k)
		{
			case 38:
				action = PutTommorow(); break;
			case 40:
				action = PutYesterday(); break;
		}
		if (action == false)
			obj.select();
		return action;
	}
	function DateBoxBlur(evt)
	{
		/*j=0;
		for (var i in evt){
			alert(i+':'+evt[i]);
			j++;
			if(j>15)return false;
			}
		return false;*/
		if(typeof evt == "undefined") evt = window.event;
		//---- version 1.05, by Yahav, last edit 2004-11-02 (alert only if required)
		//get value:
		var obj=(typeof evt.srcElement!=='undefined' ? evt.srcElement : evt.target)
		var strValue=obj.value;
		//check if date and fix if possible:
		var strFixedValue=FixDate(strValue);
		if (strFixedValue.length > 0)
		{
			//apply new value:
			obj.value = strFixedValue;
		}
		else
		{
			//alert only if the field is required:
			if ((obj.attributes["date_req"])&&
			   ((obj.attributes["date_req"].value == "")||
			    (obj.attributes["date_req"].value == "1")))
			{
				alert("warning: invalid format of date: "+strValue);
			}
		}
	}
	
	function PutCurrentDate(evt)
	{
		var obj=(typeof evt.srcElement!=='undefined' ? evt.srcElement : evt.target)
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//put current date in date text box, which is the source object. must return false.
		var now=new Date();
		var strNow=DateToStr(now);
		obj.value = strNow;
		return false;
	}
	function PutYearEnd(evt)
	{
		var obj=(typeof evt.srcElement!=='undefined' ? evt.srcElement : evt.target)
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//get user input:
		var strUserDate=obj.value;
		//make it date:
		var objDate=StrToDate(strUserDate);
		//add to month until it is first month:
		if ((objDate.getMonth() == 0)||(objDate.getMonth() == 11))
			objDate.setMonth(objDate.getMonth()+1);
		if ((objDate.getMonth() == 12)||(objDate.getDate() == 31))
			objDate.setMonth(objDate.getMonth()+1);
		var vv=0;
		while ((objDate.getMonth() != 0)&&(vv++ < 1000))
			objDate.setMonth(objDate.getMonth()+1);
		//subtract from date until it is first day of month:
		while ((objDate.getDate() != 1)&&(vv++ < 1000))
			objDate.setDate(objDate.getDate()-1);
		//subtract one day from date:
		objDate.setDate(objDate.getDate()-1);
		//apply result:
		obj.value = DateToStr(objDate);
		return false;
	}
	function PutYearBegin(evt)
	{
		var obj=(typeof evt.srcElement!=='undefined' ? evt.srcElement : evt.target)
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//get user input:
		var strUserDate=obj.value;
		//make it date:
		var objDate=StrToDate(strUserDate);
		//subtract from month until it is first month:
		if ((objDate.getMonth() > 0)||((objDate.getMonth() == 0)&&(objDate.getDate() == 1)))
			objDate.setMonth(objDate.getMonth()-1);
		var vv=0;
		while ((objDate.getMonth() != 0)&&(vv++ < 1000))
			objDate.setMonth(objDate.getMonth()-1);
		//subtract from date until it is first day of month:
		while ((objDate.getDate() != 1)&&(vv++ < 1000))
			objDate.setDate(objDate.getDate()-1);
		//apply result:
		obj.value = DateToStr(objDate);
		return false;
	}
	function PutMonthEnd(evt)
	{
		var obj=(typeof evt.srcElement!=='undefined' ? evt.srcElement : evt.target)
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//get user input:
		var strUserDate=obj.value;
		//make it date:
		var objDate=StrToDate(strUserDate);
		//add to date until it's beginning of next month:
		objDate.setDate(objDate.getDate()+2);
		var vv=0;
		while ((objDate.getDate() != 1)&&(vv++ < 1000))
			objDate.setDate(objDate.getDate()+1);
		//subtract one day from date:
		objDate.setDate(objDate.getDate()-1);
		//apply result:
		obj.value = DateToStr(objDate);
		return false;
	}
	function PutMonthBegin(evt)
	{
		var obj=(typeof evt.srcElement!=='undefined' ? evt.srcElement : evt.target)
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//get user input:
		var strUserDate=obj.value;
		//make it date:
		var objDate=StrToDate(strUserDate);
		//subtract from date until it's beginning of month:
		objDate.setDate(objDate.getDate()-1);
		var vv=0;
		while ((objDate.getDate() != 1)&&(vv++ < 1000))
			objDate.setDate(objDate.getDate()-1);
		//apply result:
		obj.value = DateToStr(objDate);
		return false;
	}
	function PutNextSunday(evt)
	{
		var obj=(typeof evt.srcElement!=='undefined' ? evt.srcElement : evt.target)
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//get user input:
		var strUserDate=obj.value;
		//make it date:
		var objDate=StrToDate(strUserDate);
		//add to date until it is sunday
		objDate.setDate(objDate.getDate()+1);
		var vv=0;
		while ((objDate.getDay() != 0)&&(vv++ < 1000))
			objDate.setDate(objDate.getDate()+1);
		//apply result:
		obj.value = DateToStr(objDate);
		return false;
	}
	function PutPreviousMonday(evt)
	{
		var obj=(typeof evt.srcElement!=='undefined' ? evt.srcElement : evt.target)
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//get user input:
		var strUserDate=obj.value;
		//make it date:
		var objDate=StrToDate(strUserDate);
		//subtract from date until it is monday:
		objDate.setDate(objDate.getDate()-1);
		var vv=0;
		while ((objDate.getDay() != 1)&&(vv++ < 1000))
			objDate.setDate(objDate.getDate()-1);
		//apply result:
		obj.value = DateToStr(objDate);
		return false;
	}
	function PutTommorow(evt)
	{
		var obj=(typeof evt.srcElement!=='undefined' ? evt.srcElement : evt.target)
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//get user input:
		var strUserDate=obj.value;
		//make it date:
		var objDate=StrToDate(strUserDate);
		//add one day to date:
		objDate.setDate(objDate.getDate()+1);
		//apply result:
		obj.value = DateToStr(objDate);
		return false;
	}
	function PutYesterday(evt)
	{
		var obj=(typeof evt.srcElement!=='undefined' ? evt.srcElement : evt.target)
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//get user input:
		var strUserDate=obj.value;
		//make it date:
		var objDate=StrToDate(strUserDate);
		//subtract one day from date:
		objDate.setDate(objDate.getDate()-1);
		//apply result:
		obj.value = DateToStr(objDate);
		return false;
	}
	function DateToStr(dt)
	{
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//get date object and returns MM/DD/YYYY string.
		var strDate="";
		strDate += AddZero(dt.getMonth()+1)+"/";
		strDate += AddZero(dt.getDate())+"/";
		var yr=dt.getYear()+'';
		yr=yr.substring( (yr.length==3 ? 1 : 0) , (yr.length==3 ? 3 : 2));
		strDate += yr;
		return strDate;
	}
	function StrToDate(strDate)
	{
		//---- version 1.0, by Yahav, last edit 2004-10-30
		//get MM/DD/YYYY string and returns date object.
		var dt=new Date();
		var arrDateParts=strDate.split("/");
		if (arrDateParts.length > 0)
			dt.setMonth(StrToInt(arrDateParts[0]-1));
		if (arrDateParts.length > 1)
			dt.setDate(StrToInt(arrDateParts[1]));
		if (arrDateParts.length > 2)
			dt.setYear(StrToInt(arrDateParts[2]));
		alert(dt);
		return dt;
	}
	function FixDate(str)
	{
		//---- version 1.05, by Yahav, last edit 2004-11-02 (added break-point)
		//return empty string for invalid value!
		//valid format is only: MM/DD/YYYY or MM/DD/YY or MM/DD and year will be added
		//get current date:
		var now=new Date();
		//get parts:
		var arrDateParts=str.split("/");
		//check that at least day and month given:
		if (arrDateParts.length < 2)
			return "";
		//check day and month:
		var iMonth=StrToInt(arrDateParts[0]);
		var iDay=StrToInt(arrDateParts[1]);
		if ((iMonth <= 0)||(iMonth > 12))
			return "";
		if ((iDay <= 0)||(iDay > 31))
			return "";
		//check year:
		var iYear=(arrDateParts.length > 2)?arrDateParts[2]:(now.getYear()+"");
		if ((iYear.length != 2)&&(iYear.length != 2*2))
			return "";
		if (StrToInt(iYear) < 0)
			return "";
		//decide if 1900 or 2000 century:
		var strCentury=(iYear+"");
		if (iYear.length == 2)
			strCentury = (StrToInt(iYear<BREAK_POINT))?"20"+iYear:"19"+iYear;
		return AddZero(iMonth)+"/"+AddZero(iDay)+"/"+strCentury;
	}
	function StrToInt(str)
	{return (str)*(-1)*(-1);}
	function AddZero(num)
	{return ((num >= 0)&&(num < 10))?"0"+num:num;}
	//usage:
	// <input type=text id="test_date_box" date_box="1" /> 