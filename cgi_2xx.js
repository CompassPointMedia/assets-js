/*
Created 2010-11-05


11/6 - so this began with me wanting to pop up a cgi component (login form or add new record)

*/

function modalFirst(e){
	if(!this.modalEnvironmentSet){
		//from http://www.hunlock.com/blogs/Howto_Dynamically_Insert_Javascript_And_CSS
		var headID = document.getElementsByTagName("head")[0];         
		var bodyID = document.getElementsByTagName("body")[0];         

		var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.href = '/cgi/components/css/API_cgi_2xx.css?rand='+Math.random();
		cssNode.media = 'screen';
		headID.appendChild(cssNode);
	
		var boxNode = document.createElement('div');
		boxNode.id = 'modalWrapper';
		bodyID.appendChild(boxNode);
		g('modalWrapper').innerHTML='<div id="dialog1" class="modalWindow">  <div class="d-header">  <input type="text" value="username" onclick="this.value=\'\'"/><br/>  <input type="password" value="Password" onclick="this.value=\'\'"/> </div> <div class="d-blank"></div> <div class="d-login"><input type="image" alt="Login" title="Login" src="images/login-button.png"/></div> </div>';
	
		var maskNode = document.createElement('div');
		maskNode.id = 'bodyLevelMask';
		bodyID.appendChild(maskNode);

		this.modalEnvironmentSet=true;	
	}


	//Get the screen height and width
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();

	//Set heigth and width to mask to fill up the whole screen
	$('#bodyLevelMask').css({'width':maskWidth,'height':maskHeight});

	return;
	//transition effect		
	$('#bodyLevelMask').fadeIn(1000);	
	$('#bodyLevelMask').fadeTo("slow",0.8);	
	return;
	

	//Get the window height and width
	var winH = $(window).height();
	var winW = $(window).width();
		  
	//Set the popup window to center
	$('#dialog1').css('top',  winH/2-$('#dialog1').height()/2);
	$('#dialog1').css('left', winW/2-$('#dialog1').width()/2);

	//transition effect
	$('#dialog1').fadeIn(2000); 



}


function setModalEnv(e){
	if(this.modalEnvironmentSet){
		return true;
	}
	//from http://www.hunlock.com/blogs/Howto_Dynamically_Insert_Javascript_And_CSS
	var headID = document.getElementsByTagName("head")[0];         
	var cssNode = document.createElement('link');
	cssNode.type = 'text/css';
	cssNode.rel = 'stylesheet';
	cssNode.href = '/cgi/components/css/API_cgi_2xx.css?rand='+Math.random();
	cssNode.media = 'screen';
	headID.appendChild(cssNode);

	var bodyID = document.getElementsByTagName("body")[0];         
	var boxNode = document.createElement('div');
	boxNode.id = 'modalWrapper';
	bodyID.appendChild(boxNode);
	g('modalWrapper').innerHTML='<div id="dialog1" class="modalWindow">  <div class="d-header">  <input type="text" value="username" onclick="this.value=\'\'"/><br/>  <input type="password" value="Password" onclick="this.value=\'\'"/> </div> <div class="d-blank"></div> <div class="d-login"><input type="image" alt="Login" title="Login" src="images/login-button.png"/></div> </div>';

	var maskNode = document.createElement('div');
	maskNode.id = 'bodyLevelMask';
	bodyID.appendChild(maskNode);
	
	//coder: I put this inside this function because I was not able to get the HIDE part done, since the bodyLevelMask div wasn't in existence prior to this
	$(document).ready(function() {	
	
		//select all the a tag with name equal to modal
		$('a[name=modal]').click(function(e) {
			//Cancel the link behavior
			e.preventDefault();
			
			//Get the A tag
			var id = $(this).attr('href');
		
			//Get the screen height and width
			var maskHeight = $(document).height();
			var maskWidth = $(window).width();
		
			//Set heigth and width to mask to fill up the whole screen
			$('#bodyLevelMask').css({'width':maskWidth,'height':maskHeight});
			
			//transition effect		
			$('#bodyLevelMask').fadeIn(1000);	
			$('#bodyLevelMask').fadeTo("slow",0.8);	
		
			//Get the window height and width
			var winH = $(window).height();
			var winW = $(window).width();
				  
			//Set the popup window to center
			$(id).css('top',  winH/2-$(id).height()/2);
			$(id).css('left', winW/2-$(id).width()/2);
		
			//transition effect
			$(id).fadeIn(2000); 
		
		});


		//if close button is clicked
		$('.modalWindow .close').click(function (e) {
			//Cancel the link behavior
			e.preventDefault();
			
			$('#bodyLevelMask').hide();
			$('.modalWindow').hide();
		});		
		
		//if mask is clicked
		$('#bodyLevelMask').click(function () {
			$(this).hide();
			$('.modalWindow').hide();
		});			
		
	});
	this.modalEnvironmentSet=true;
}
