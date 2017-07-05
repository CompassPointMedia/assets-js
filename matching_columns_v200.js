$(document).ready(function(){
	$('img').each(function(n,v){
		alert('here');		return false;																			   
																					   });			   
	return;
	if(balanceColumns){
		var b=balanceColumns;
		for(var i in b){
			alert($(b[i]));
			/*.each(function(n,v){
				alert($(this));
			});
			*/
		}
	}
});
