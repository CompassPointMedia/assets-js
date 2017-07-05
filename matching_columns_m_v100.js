/* 
Derived from a script by Alejandro Gervasio. 
Modified to work in FireFox by Stefan Mischook for Killersites.com
How it works: just apply the CSS class of 'column' to your pages' main columns.
*/



/*
2011-04-27:
Modified the way this loads so it doesn't interfere.  Must call the loader script before this
2008-05-14:
Modified to handle both heights and WIDTHS, see the array matchRowSet below
2008-03-15: 
Modified to match columns for multiple areas by Samuel Fullman sam.fullman@verizon.net
Just declare the classnames for EACH column group that you want to match up - these can be declared on the page instead.
NOTE: padding declared on the div may cause unexpected results based on your box model
*/

var matchColumnsSet=[];
matchColumnsSet[matchColumnsSet.length]=/\bballoon1\b/
matchColumnsSet[matchColumnsSet.length]=/\bcolumn\b/

var matchRowSet=[];
matchRowSet[matchRowSet.length]=/\bmatchrow\b/



callMatchColumns=function(){
	//call matchColumns for the declared set
	for(var i in matchColumnsSet) matchColumns(matchColumnsSet[i],'h');
	for(var i in matchRowSet) matchColumns(matchRowSet[i],'w');
}
function matchColumns(group, dim){ 
     var divs,contDivs,maxHeight,divHeight,maxWidth,divWidth,d; 
     // get all <div> elements in the document 
     divs=document.getElementsByTagName('div'); 
     contDivs=[]; 
	 var balances=[];
     // initialize maximum height value 
     maxHeight=0; 
     maxWidth=0; 
     // iterate over all <div> elements in the document 
     for(var i=0;i<divs.length;i++){ 
        // make collection with <div> elements with class attribute 'container' 
          
		for(var j=0; j<matchColumnsSet.length; j++){
		  if(group.test(divs[i].className)){ 
                d=divs[i]; 
                contDivs[contDivs.length]=d; 
                // determine height for <div> element 
				if(dim=='h'){
					if(d.offsetHeight){ 
						 divHeight=d.offsetHeight; 					
					} 
					else if(d.style.pixelHeight){ 
						 divHeight=d.style.pixelHeight;					 
					} 
				}else{
					if(d.offsetWidth){ 
						 divWidth=d.offsetWidth; 					
					} 
					else if(d.style.pixelWidth){ 
						 divWidth=d.style.pixelWidth;					 
					} 
				}
                // calculate maximum height 
				//if(dim=='w')alert(maxWidth+':'+divWidth);
                dim=='h' ? maxHeight=Math.max(maxHeight,divHeight) : maxWidth=Math.max(maxWidth,divWidth); 
          } 
		}
     } 
     // assign maximum height value to all of container <div> elements 
     for(var i=0;i<contDivs.length;i++){ 
	 	//alert(contDivs[i].id);
          dim=='h' ? contDivs[i].style.height=maxHeight + "px" : contDivs[i].style.width=maxWidth + "px"; 
     } 
} 
// Runs the script when page loads 
if(false){
	window.onload=function(){ 
		 if(document.getElementsByTagName){ 
			  callMatchColumns();			 
		 } 
	}
}
//2011-04-27 old method; new method below
function cmcOnload(){
	 if(document.getElementsByTagName){ 
		  callMatchColumns();			 
	 } 
}
AddOnloadCommand('cmcOnload()');

