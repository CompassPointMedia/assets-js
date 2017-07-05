/***
Last Edited: 2004-12-14
By: Yahav Braverman
Starting with escape event, more to come
Added Ctrl-Shift-P code to focus parent window.
changed the code to allow other code to execute in the onkeypress as well.
***/

//try to attach our code to the global event handler:
if (typeof AddOnkeypressCommand != "undefined")
{
	AddOnkeypressCommand("PropKeyPress()");
}
else
{
	document.onkeypress = PropKeyPress;
}

//document.onkeypress()
function PropKeyPress()
{
	if(event.keyCode==27){
		if(isEscapable==2 || (isEscapable==1 && (!detectChange || (detectChange && confirm(escMessage))))){
			//eventually, deal with window to focus on onClose
			window.close();
		}
	}
	
	if((window.event.shiftKey)&&(window.event.ctrlKey)&&(event.keyCode == 16))
	{
		try
		{
			window.opener.focus();
		}
		catch(e)
		{
		}
	}
}
