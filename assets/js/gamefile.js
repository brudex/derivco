/*
 Author Penrose aka brudex
 https://github.com/brudex
*/
 let count = 0;
 const slotLasIndex = 13;
 let winningPrices = [];
 const btnSpin = document.getElementById('btnSpin');
 const txtBalance = document.getElementById("txtBalance");
 const casino1 = document.querySelector('#casino1');
 const casino2 = document.querySelector('#casino2');
 const casino3 = document.querySelector('#casino3');
 const debugSlotOptions = {slot1:0,slot2:0,slot3:0};
 let debugMode = false;
 const mCasino1 = new SlotMachine(casino1, {
	active: 0,
	delay: 500, 
});
const mCasino2 = new SlotMachine(casino2, {
	 active: 1,
	 delay: 500
   });
   
const mCasino3 = new SlotMachine(casino3, {
	 active: 2,
	 delay: 500
   });

 function initSlotsIfDebug(){
	if(debugMode){
	  	mCasino1.randomize = function() {
		   return debugSlotOptions.slot1;
		 }
		mCasino2.randomize = function() {
			return debugSlotOptions.slot2;
		}
		mCasino3.randomize = function() {
			return debugSlotOptions.slot3;
		}
 
	}else{
		mCasino1.randomize = null;
		mCasino2.randomize = null;
		mCasino3.randomize = null; 
	}
  
}


 const winTable = {
	 "cherrycherrycherryTop" :"3cherryTop",
	 "cherrycherrycherryCenter" :"3cherryCenter",
	 "cherrycherrycherryBottom" :"3cherryBottom",
	 "777" :"3seven",
	 "7cherrycheery" :"any7cherry",
	 "77cheery" :"any7cherry",
	 "3xbar3xbar3xbar" :"3xBar",
	 "2xbar2xbar2xbar" :"2xBar",
	 "1xbar1xbar1xbar" :"1xBar",
	 "barbarbar" :"1xBar",
	 "bars" :"anyBars"
 } 
 
 function showNotification(title,message){
	iziToast.show({
			title: title,
			message: message
		}); 
  }

 

 function checkBalance(){
	 var balance = txtBalance.value;
	 if(!isNaN(balance))
	 if(balance!=null){
		 if(parseInt(balance)>0){
			 var balance = parseInt(balance);
			 if(balance >= 1 && balance <= 5000){
				 return true;
			 } 
		 }
	 }
	 return false;
 }

 function addToBalance(amount){
	var currentBal = txtBalance.value;
	if(!isNaN(currentBal)){
		 let currBal = parseInt(currentBal);
		 currBal +=amount 
		currentBal = ""+ currBal;
	}
	txtBalance.value = currentBal;
 } 
 

 function deactivateControls(){
	txtBalance.disabled = true;
	btnSpin.disabled = true;
 }

 function activateControls(){
	setTimeout(function(){
		txtBalance.disabled = false;
		btnSpin.disabled = false;
	},1000) 
 }
  
 function resetSlots(){
	 winningPrices = [];
	 var els = document.getElementsByClassName("winPrice");
	 for (let el of els) {
		el.classList.remove("blinkWin");
	 } 
	 var slotLines = document.getElementsByClassName("slotLine")[0].querySelectorAll("hr");
 	 for (let el of slotLines) {
		el.classList.remove("winLine");
	 } 
 }

 btnSpin.addEventListener('click', () => {
	 if(checkBalance()){
		 if(winningPrices.length){
			 console.log('Resetting slots>>');
			resetSlots();
		 } 
		 initSlotsIfDebug();
		 deactivateControls();
		 mCasino1.shuffle(9999);
		 mCasino2.shuffle(9999);
		 mCasino3.shuffle(9999);
		 addToBalance(-1);
		 stopAfterSeconds(3);
	 }else{
		 alert("Enter balance between 1 and 5000");
	 } 
  });

 function stopAfterSeconds(seconds){
	 setTimeout(function(){
		 mCasino1.stop();
		 setTimeout(function(){
			 mCasino2.stop();
			 setTimeout(function(){
				 mCasino3.stop();
				 console.log('from the stop The onslot1 innerText',mCasino1.active);
				 console.log('from the stop The onslot2 innerText',mCasino2.active);
				 console.log('from the stop The onslot3 innerText',mCasino3.active);
				 processSlotValues();
				 activateControls();
			 },500)
		 },1000)
	 },(seconds *1000))
 } 

 function processSlotValues(){
	 var slot1Data  = getSlotIndex(mCasino1);
	 var slot2Data  = getSlotIndex(mCasino2);
	 var slot3Data  = getSlotIndex(mCasino3); 
	 console.log('Slot1Data ',slot1Data);
	 var slotMatrix = {};
	 var arr1 = getImagesForSlotColumn('casino1',slot1Data);
	 var arr2 = getImagesForSlotColumn('casino2',slot2Data);
	 var arr3 = getImagesForSlotColumn('casino3',slot3Data);
	 var transposed = transposeArray([arr1,arr2,arr3]);
	 slotMatrix.slot1=transposed[0];
	 slotMatrix.slot2=transposed[1];
	 slotMatrix.slot3=transposed[2];
	 console.log('the slot matrix >>',slotMatrix);
	 var winRowsSlot1 = getCssClassOfWinSlots(slotMatrix.slot1,"Top");
	 var winRowsSlot2 = getCssClassOfWinSlots(slotMatrix.slot2,"Center");
	 var winRowsSlot3 = getCssClassOfWinSlots(slotMatrix.slot3,"Bottom");
	 blinkWinningRows(winRowsSlot1);
	 blinkWinningRows(winRowsSlot2);
	 blinkWinningRows(winRowsSlot3);  
	 markWinningLines("slotLine1",winRowsSlot1);
	 markWinningLines("slotLine2",winRowsSlot2);
	 markWinningLines("slotLine3",winRowsSlot3); 

	 setTimeout(function(){
		addWinningAmountsToBalance(winningPrices);
	 },1000)
 }

  

 function getCssClassOfWinSlots(slotArr,position){
	 var tableKey ="";
	 var winSlots =[];
	 slotArr.forEach(function(item){
		 winSlots.push(item.toLowerCase());
	 });
	 if(winSlots.every( (val, i, arr) => val === arr[0] )){
		 if(winSlots[0]==="cherry"){
			 tableKey = winSlots.join("")+position;
		 }else{
			 tableKey = winSlots.join("");
		 }
		 console.log('The tableKey for win Table >>',tableKey);
		 return winTable[tableKey];
	 }else{
		var obj = countElementsInArray(winSlots);
		console.log('Elements in array>>>',obj);
		if(obj["7"]){
			if(obj["7"]>1){
				if(obj["cherry"]){
				   return winTable["77cheery"] ;
				}
			}else if(obj["cherry"]>1){
				 if(obj["7"]){
				   return winTable["7cherrycheery"] ;
				}
			}
		}
		 console.log('Is not a 7>>>');
		 tableKey = winSlots.join("");
		 var count = (tableKey.match(/bar/g) || []).length;
		 if(count === 3){
			 console.log('Return bars')
			 return winTable["bars"];
		 }
	 }
	 return "";
 } 

 function getSlotIndex(casinoSlot){
	 var slotData  = [];
	 var index = casinoSlot.active;
	 console.log('The index>>',index);
	 if(!isNaN(index)){
		 slotData.push(parseInt(index));
		 let nIndex = parseInt(index) + 1;
		 if(nIndex > slotLasIndex){
			 nIndex = 0;
		 }
		 slotData.push(nIndex);
		 nIndex+=1;
		 if(nIndex > slotLasIndex){
			 nIndex = 0;
		 } 
		 slotData.push(nIndex); 
	 }
	 return slotData; 
 }

 function getImagesForSlotColumn(slotMachine,indices){
	 var arr =[];
	 indices.forEach(function(item){
		var img =  getImageAtSlot(slotMachine,item);
		arr.push(img);
	 });
	 return arr;
 }

 function getImageAtSlot(slotMachine,index){
	 var class_Name = "slot"+index;
	 var el =  document.getElementById(slotMachine).getElementsByClassName(class_Name)[0].querySelector("img").alt;
	 return el;
 }

 function transposeArray(array){
	return array[0].map((col, i) => array.map(row => row[i]));
 }

 function countElementsInArray(original) { 
	 var a = original.reduce(function (acc, curr) {
		 if (typeof acc[curr] == 'undefined') {
			 acc[curr] = 1;
		 } else {
			 acc[curr] += 1;
		 } 
		 return acc;
		 }, {});
		 return a;
 }

 function addWinningAmountsToBalance(arr){
	if(arr.length){
		let totalWin = arr.reduce((a, b) => a + b, 0);
		let msg = "";
		for(let i=0,len=arr.length;i<len;i++){
			if(i===0){
			  msg = "$" + arr[i]; 
			}else{
				msg += " + $" +arr[i];
			}
		} 
		showNotification("You have won $"+totalWin + " = ", msg);
		showNotification("", "Price has been added to your balance");
		arr.forEach( x=> addToBalance(x));
	} 
	
 }



 function blinkWinningRows(cssClass){
	 console.log('Blinking css class for row >>',cssClass);
	 if(cssClass!==""){
		 var el =  document.getElementsByClassName(cssClass)[0].getElementsByClassName("winPrice");
		 console.log("the elements are >>",el);
		 if(el.length){
			 el[0].classList.add('blinkWin');
			 console.log('Blink class added');
			 let text = el[0].innerText;
			 console.log('Dollar value ',text);
			 let amt = text.replace("$","");
			 winningPrices.push(parseInt(amt));
		 }  
	 } 
 }

 function markWinningLines(slotLine, winClass){
 	if(winClass!==""){
		var el =  document.getElementsByClassName(slotLine)[0];
		el.classList.add('winLine');  
	} 
}

$('#toggleDebug').change(function() {
	let isChecked = $(this).prop('checked');
	if(isChecked){
		toggleDebug(true);
	}else{
		toggleDebug(false);
	}
 })

function toggleDebug(enable){
	if(enable){
		$('#debugOptions').slideDown();
		debugMode = true;
	}else{
		$('#debugOptions').slideUp();
		debugMode = false;
	}
 }

 

var slotOptions = [
	{
		text: "3XBAR",
		value: 0,
		selected: true,
		description: "3XBAR",
		imageSrc: "/assets/img/3xBAR.png"
	},
	{
		text: "BAR",
		value: 1,
		selected: false,
		description: "2xBAR",
		imageSrc: "/assets/img/BAR.png"
	},
	{
		text: "2XBAR",
		value: 2,
		selected: false,
		description: "2XBAR",
		imageSrc: "/assets/img/2xBAR.png"
	},
	{
		text: "7",
		value: 3,
		selected: false,
		description: "Seven",
		imageSrc: "/assets/img/7.png"
	},
	{
		text: "Cherry",
		value: 4,
		selected: false,
		description: "Cherry",
		imageSrc: "/assets/img/Cherry.png"
	} 	 
];

$('#slotOption1').ddslick({
    data:slotOptions,
    width:300,
    selectText: "Select symbol",
    imagePosition:"right",
    onSelected: function(selectedData){
        console.log("Selected data for lot option 1>>>", selectedData);
        debugSlotOptions.slot1 = selectedData.selectedData.value;
    }   
});
$('#slotOption2').ddslick({
    data:slotOptions,
    width:300,
    selectText: "Select symbol",
    imagePosition:"right",
    onSelected: function(selectedData){
		console.log("Selected data for lot option 2>>>",selectedData);
        debugSlotOptions.slot2 = selectedData.selectedData.value;
    }   
});
$('#slotOption3').ddslick({
    data:slotOptions,
    width:300,
    selectText: "Select symbol",
    imagePosition:"right",
    onSelected: function(selectedData){
        console.log("Selected data for lot option 3>>>",selectedData);
        debugSlotOptions.slot3 = selectedData.selectedData.value;
    }   
});
 
