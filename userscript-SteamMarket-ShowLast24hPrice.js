// ==UserScript==
// @name     Steam_24h_sold
// @description |THIS SCRIPT ADDS A BUTTON WHICH SHOWS HOW MANY TIMES EACH ITEM IN market/search ROWS WAS SOLD IN THE LAST 24H
// @version  1.0
// @namespace    st_search
// @match      *://steamcommunity.com/market/search*
// @run-at       document-end
// ==/UserScript==
var parentElem = document.getElementsByClassName('market_search_results_header'); //selects element to which the button will be appended

if (!document.getElementById("value24Btn") && parentElem[0]) {
    var zNode = document.createElement('div'); //creates new element which contains the button
    zNode.setAttribute('id', "value24Btn");
    zNode.innerHTML = '<button id="value24Btn" type="button">' +
        '24h values</button>';


    parentElem[0].append(zNode); //places button on a page
    zNode.style.display = "inline-block";
    zNode.style.margin = "10px 0";

}

var daHead = document.head || document.getElementsByTagName("head")[0];

function addSrpt(jsString) { //adds innerHTML as a Script

    //return unless head;
    if (daHead) {
        var newJs = document.createElement('script');
        newJs.type = "text/javascript";
        newJs.innerHTML = jsString;
        daHead.appendChild(newJs);
    }
}

//	Unfortunately Firefox (I use Greasemonkey) has problems with Ajax requests if they`re called in a userscript
//	(even GM.xmlHttpRequest is no help), so I had to call it in innerHTML.
//	JavaScript String Escape / Unescape  tool was very useful

addSrpt('\r\nfunction addMarketBoxes(el, val, my_bool) {\r\n\tvar zNode = document.createElement (\'div\');\t\r\n if(my_bool){\r\n\t\t\t\tzNode.innerHTML = \'<span class=\"market_table_value\">\'+val+\'<\/span>\'; el.append(zNode);\r\n\t\t\t\tconsol.log(val);}\r\n\t\t\t\t  else {\r\n\t\t\t\t\t zNode.innerHTML = \'<span class=\"market_table_value\">0<\/span>\'; el.append(zNode);\r\n\t\t\t\t\tconsol.log(val);}\r\n        }\r\n\r\n\r\nconst sleeep = (milliseconds) => {\r\n\treturn new Promise(resolve => setTimeout(resolve, milliseconds))\r\n}\r\n\r\n\r\ndocument.getElementById(\"value24Btn\").addEventListener (\"click\", wasSoldLastDay);\r\n\r\nfunction wasSoldLastDay () {\r\n\t  sleeep(1500).then(() => {\r\n\t\t\tvar allElements = document.getElementsByClassName(\'market_recent_listing_row\');\r\n\r\n\t\t\tArray.prototype.forEach.call(allElements, function(el) {\r\n\r\n\t\t\t\tvar hash = el.getAttribute(\"data-hash-name\");\r\n\t\t\t\tvar appid = el.getAttribute(\"data-appid\");\r\n\t\t\t\t\r\n\t\t\t\tvar infoBox = el.getElementsByClassName(\'market_table_value normal_price\');\r\n\t\t\t\t\r\n\t\t\t\tif(hash && appid){\r\n\t\t\t\t\t   new Ajax.Request( \'https:\/\/steamcommunity.com\/market\/priceoverview\/\', {\r\n\t\t\t\t\t\t\tmethod: \'get\',\r\n\t\t\t\t\t\t\tparameters: {\r\n\t\t\t\t\t\t\t\tcountry: g_strCountryCode,\r\n\t\t\t\t\t\t\t\tcurrency: typeof( g_rgWalletInfo ) != \'undefined\' ? g_rgWalletInfo[\'wallet_currency\'] : 1,\r\n\t\t\t\t\t\t\t\tappid: el.getAttribute(\"data-appid\"),\r\n\t\t\t\t\t\t\t\tmarket_hash_name: hash,\r\n\t\t\t\t\t\t\t},\r\n\t\t\t\t\t\t\tonSuccess: function( transport ) {\r\n\t\t\t\t\t\t\t\tif ( transport.responseJSON && transport.responseJSON.success )\r\n\t\t\t\t\t\t\t\t{\r\n\t\t\t\t\t\t\t\t\tif ( transport.responseJSON.volume )\r\n\t\t\t\t\t\t\t\t\t{\r\n\t\t\t\t\t\t\t\t\t\taddMarketBoxes(infoBox[0], transport.responseJSON.volume, true);  \r\n\t\t\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t\t\t\telse\r\n\t\t\t\t\t\t\t\t\t{\r\n\t\t\t\t\t\t\t\t\t\taddMarketBoxes(infoBox[0], transport.responseJSON.volume, false);\r\n\t\t\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t\t},\r\n\t\t\t\t\t\t\tonFailure: function( transport ) { console.log(\'ERROR: 24h price\');}\r\n\t\t\t\t\t\t});\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t}\t\t\r\n\t\t\t}); \r\n\t});\r\n}\r\n');

//-----------------------innerHTML content
/* 
function addMarketBoxes(el, val, my_bool) { //creates a container for " last 24h sold" value
	var zNode   = document.createElement ('div');	
                  if(my_bool){
					zNode.innerHTML = '<span class="market_table_value">'+val+'</span>'; el.append(zNode);}
				  else {
					 zNode.innerHTML = '<span class="market_table_value">0</span>'; el.append(zNode);
					consol.log(val);}
        }


const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}


document.getElementById("value24Btn").addEventListener ("click", wasSoldLastDay); //finds our button

function wasSoldLastDay () {  //gets the value we need
	  sleep(1500).then(() => {
			var allElements = document.getElementsByClassName('market_recent_listing_row');

			Array.prototype.forEach.call(allElements, function(el) {

				var hash = el.getAttribute("data-hash-name");
				var appid = el.getAttribute("data-appid");
				
				var infoBox = el.getElementsByClassName('market_table_value normal_price');
				
				if(hash && appid){
					   new Ajax.Request( 'https://steamcommunity.com/market/priceoverview/', {
							method: 'get',
							parameters: {
								country: g_strCountryCode,
								currency: typeof( g_rgWalletInfo ) != 'undefined' ? g_rgWalletInfo['wallet_currency'] : 1,
								appid: el.getAttribute("data-appid"),
								market_hash_name: hash,
							},
							onSuccess: function( transport ) {
								if ( transport.responseJSON && transport.responseJSON.success )
								{
									if ( transport.responseJSON.volume )
									{
										addMarketBoxes(infoBox[0], transport.responseJSON.volume, true);  
									}
									else
									{
										addMarketBoxes(infoBox[0], transport.responseJSON.volume, false);
									}
								}
							},
							onFailure: function( transport ) { console.log('ERROR: 24h price  Ajax Request FAILED');}
						});
						
					}		
			}); 
	});
}

*/
