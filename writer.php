<?php 
/*
2012-05-12
//here is a sample google maps API script call:
http://maps.google.com/maps?file=api&v=2&sensor=false&key=ABQIAAAAPDUET0Qt7p2VcSk6JNU ..

* this file is being called with an account/key and I feel we should be doing as well, as well as a version number; no idea what sensor means =)
* goal is to eventually lose the .php extension as long as the browser does not cache - they don't use a .js extension either


*/

//call css assets
# as of 5/12/2012 this is done in the body-level call

//call js assets
# as of 5/12/2012 this is done in the body-level call

if(false){ ?><script language="javascript" type="text/javascript"><?php } ?>
function GLFranchise_writer(){
	var str='<'+'script language="javascript" type="text/javascript" src="//'+GLFranchise_account+'.glfranchise.com/gf5/console/writer.php?';
	var a=GLFranchise_formCall;
	for(var i in a){
		str+=i.toLowerCase()+'='+escape(a[i])+'&';
	}
	str=str.replace(/&$/,'');
	str+='" />';
	str+='<'+'/script>';
	document.write(str);
}
<?php if(false){ ?></script><?php } ?>