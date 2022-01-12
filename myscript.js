if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}   

let drawCardURL;
let gameStart = 0;
let botGameStart = 0;
let totalValue = 0;
let botTotalValue = 0;
let botCardsNum = 0;
let botStandCount = 0;
let botCardsWidth = 0;
let cardsNum = 0;
let cardsWidth = 0;
let aceCounter = 0;


function newDeck() {
	
	let url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
	
	fetch(url)
    .then(response => response.json())
    .then(data => update(data)
    );
}

function update(data) {
	
	console.log(data.deck_id);//gets deck Id
	
    drawCardURL = "https://deckofcardsapi.com/api/deck/" + data.deck_id + "/draw/?count=1";
}


function drawCard() {
	fetch(drawCardURL)
    .then(response => response.json())
    .then(data2 => updatePage(data2)
    );
}

function updatePage(data2) {
  
  cardsNum++;
  
  cardsWidth = cardsNum * 160;
  
  document.getElementById("center3").style.width = cardsWidth + "px";
  document.getElementById("center2").style.marginTop = "0px";
  
    
    document.getElementById("blackJackMain").innerHTML += "<img class='card' src='" + data2.cards[0].image + "' alt='card'>";

    if (data2.cards[0].value == "KING" || data2.cards[0].value == "QUEEN" || data2.cards[0].value == "JACK") {
		data2.cards[0].value = 10;
	}
	if (data2.cards[0].value == "ACE") {
		data2.cards[0].value = 11;
    aceCounter++
	}
  
	
	let value = parseInt(data2.cards[0].value);

	totalValue = totalValue + value;

    if ( totalValue > 21 ){
		stand();
	}
    if (aceCounter > 1) {
      closeLightBox();
    }
  console.log("ace counter: " + aceCounter)

	document.getElementById("totalValue").innerHTML = "Your current score is: " + totalValue;
    
    if (gameStart < 1) {
        drawCard();
        gameStart++;
    }
}

//bot 
function botDrawCard() {
	
	  fetch(drawCardURL)
      .then(response => response.json())
      .then(data3 => updateBot(data3)
      );
	
}

function updateBot(data3) {
	
    //while(botTotalValue < 17) {

   if (botGameStart < 2) {
       botCardsNum++;
       botGameStart++;
     
     botCardsWidth = botCardsNum * 160;
     
     
     document.getElementById("center").style.width = botCardsWidth + "px";
       
	if (botStandCount == 0) {
        botDrawCard();
    }
       
        document.getElementById("botCardsFront").innerHTML += "<img class='card' src='" + data3.cards[0].image + "' alt='card'>";
       
		if (data3.cards[0].value == "KING" || data3.cards[0].value == "QUEEN" || data3.cards[0].value == "JACK") {
			data3.cards[0].value = 10;
		}
		if (data3.cards[0].value == "ACE") {
			data3.cards[0].value = 11;
		}
		console.log("bot card value: " + data3.cards[0].value);
       
		
		let botValue = parseInt(data3.cards[0].value);
		
		botTotalValue = botTotalValue + botValue;
       
       let img = new Image();
        img.src = 'images/card.png';
        img.classList.add("card");
        img.classList.add("back");
        document.getElementById('botCardsBack').appendChild(img); 
       
       if (botGameStart == 1) {
           document.getElementById("botCardsBack").innerHTML = "";
           document.getElementById("botCardsFront").innerHTML = "";
           document.getElementById("botCardsFirst").innerHTML = "<img class='card' src='" + data3.cards[0].image + "' alt='card'>";     
       } else {
           document.getElementById("botCardsBack").style.display = "block";
           document.getElementById("botCardsFront").style.display = "none";
       }
       
       if(botStandCount > 0 ) {
           botStand();
       }
	}
	
}//uptade bot

function botStand() {
  
  if(botCardsNum == 0) {
    drawCard();
    botDrawCard();
  } else {

    document.getElementById("botCardsBack").style.display = "none";
    document.getElementById("botCardsFront").style.display = "block";
    
    if (botTotalValue > 16){
        setTimeout(function() { stand(); },1200);
    } else {
        botGameStart--;
        botStandCount++;
        setTimeout(function() { botDrawCard(); },500);
    }
  }

}

function stand() {
	document.getElementById("lightbox").style.display="block";
	
    if (totalValue > 21){
        document.getElementById("message").innerHTML = "Bust! <br> Your Score: " + totalValue + "<br><br> Click anywhere to start a new game";
    }
    
	if (botTotalValue == totalValue && (botTotalValue <= 21 && totalValue <= 21)) {
		document.getElementById("message").innerHTML = "You tied!<br>Your score: " + totalValue + "<br> score: " + botTotalValue + "<br><br> Click anywhere to start a new game";
	}
	
	 if (botTotalValue > totalValue && botTotalValue <= 21){
		document.getElementById("message").innerHTML = "You Lost!<br>Your score: " + totalValue + "<br>Oponnents score: " + botTotalValue + "<br><br> Click anywhere to start a new game";
	}
	
	if ((totalValue > botTotalValue && totalValue <= 21) || (botTotalValue > 21 && totalValue <= 21)) {
		document.getElementById("message").innerHTML = "You Won!<br>Your score: " + totalValue + "<br>Oponnents score: " + botTotalValue + "<br><br> Click anywhere to start a new game";
	}

}

//close light box
function closeLightBox(){
     document.getElementById("lightbox").style.display="none";
	 document.getElementById("message").innerHTML = "";
	 
	 //prepare new game
      gameStart = 0;
      botGameStart = 0;
      botStandCount = 0;
      botStandCount = 0;
	  document.getElementById("blackJackMain").innerHTML = "";
	  totalValue = 0;
	  document.getElementById("totalValue").innerHTML = "Your current score is: 0";
  
    if (window.matchMedia("(max-width: 768px)").matches) {
        document.getElementById("center2").style.marginTop = "125.1px";
    } else {
        document.getElementById("center2").style.marginTop = "222.4px";
    }
    
    
    
	  document.getElementById("botCardsFront").innerHTML ="";
    document.getElementById("botCardsBack").innerHTML ="";
    document.getElementById("botCardsFirst").innerHTML ="";
    
    document.getElementById("botCardsBack").style.display = "block";
    document.getElementById("botCardsFront").style.display = "none";
	  botTotalValue = 0;
    botCardsNum = 0;
    botStandCount = 0;
    botCardsWidth = 0;
    cardsNum = 0;
    cardsWidth = 0;
    aceCounter = 0;
	  
	  newDeck();
	 
 }