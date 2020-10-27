
var body = [];

var player;

var enemies = [];
var enemyRandomisationState = 0;

var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var spacePressed = false;

var arrows = [];
var arrowsState = [];
var arrowsLength = -1;
var myOpacity;

var x1 = [];
var x2 = [];
var y1 = [];
var y2 = [];

var yCoord = [];
var xCoord = [];

var myMove;

var myFire;
var fireIntervalSet = false;

var score;
var scoreReached;
var scoreP = [];
var playerLife;
var health;
var lives;
var currentScore = 0;

var winningMessage;
var losingMessage;
var winningMessageGame;
var losingMessageGame;
var level2 = false;

var state;
var sound;

//Identifies an enemy and adds 'dead' class to it
function killEnemies(arrowTopLeft, arrowTopRight, arrowBottomLeft, arrowBottomRight) {

	if (arrowTopLeft.classList.contains('enemy') && !arrowTopLeft.classList.contains('hide')) {
		for (var j = 0; j < enemies.length; j++)
			if (arrowTopLeft.offsetLeft == enemies[j].offsetLeft && arrowTopLeft.offsetTop == enemies[j].offsetTop) {
				enemies[j].classList.add('dead');
			}

	} else if (arrowTopRight.classList.contains('enemy') && !arrowTopRight.classList.contains('hide')) {
		for (j = 0; j < enemies.length; j++)
			if (arrowTopRight.offsetLeft == enemies[j].offsetLeft && arrowTopRight.offsetTop == enemies[j].offsetTop) {
				enemies[j].classList.add('dead');
			}
	} else if (arrowBottomLeft.classList.contains('enemy') && !arrowBottomLeft.classList.contains('hide')) {
		for (j = 0; j < enemies.length; j++)
			if (arrowBottomLeft.offsetLeft == enemies[j].offsetLeft && arrowBottomLeft.offsetTop == enemies[j].offsetTop) {
				enemies[j].classList.add('dead');
			}
	} else if (arrowBottomRight.classList.contains('enemy') && !arrowBottomRight.classList.contains('hide')) {
		for (j = 0; j < enemies.length; j++)
			if (arrowBottomRight.offsetLeft == enemies[j].offsetLeft && arrowBottomRight.offsetTop == enemies[j].offsetTop) {
				enemies[j].classList.add('dead');
			}
	}
}


//Checks if the player character is colliding with an arrow
function detectCharacter(currentArrow, arrowLeft, arrowTop) {

	var px = player.offsetLeft;
	var py = player.offsetTop;


	if ((((currentArrow.classList.contains('left') || currentArrow.classList.contains('right')) &&
			((px == (arrowLeft - 32)) && (py < (arrowTop + 10)) && (py > (arrowTop - 64)) ||
				(px == (arrowLeft + 10)) && (py < (arrowTop + 10)) && (py > (arrowTop - 64)) ||
				(py == (arrowTop + 10) && (px >= (arrowLeft - 32)) && px <= (arrowLeft + 32)) ||
				(py == (arrowTop) && (px >= (arrowLeft - 32)) && px <= (arrowLeft + 32))
			))) ||
		((currentArrow.classList.contains('up') || currentArrow.classList.contains('down')) &&
			((px == (arrowLeft - 10)) && (py < (arrowTop + 32)) && (py > (arrowTop - 64)) ||
				(px == (arrowLeft + 10)) && (py < (arrowTop + 32)) && (py > (arrowTop - 64)) ||
				(py == (arrowTop + 30) && (px >= (arrowLeft - 10)) && px <= (arrowLeft + 10)) ||
				(py == (arrowTop) && (px >= (arrowLeft - 10)) && px <= (arrowLeft + 10))
			)))
		return true;
	return false;
}

//If detection returns false, moves the arrow in the preset direction
function moveArrow() {

	if (arrows.length > 0) {

		for (var i = 0; i < arrows.length; i++) {

			var currentArrow = arrows[i];

			var arrowLeft = currentArrow.offsetLeft;
			var arrowTop = currentArrow.offsetTop;

			//Uses an equation to get the arrow to move at an angle
			arrowLeft += xCoord[i];
			if (x1[i] >= 0)
				arrowTop = Math.floor((y2[i] - y1[i]) / (x2[i] - x1[i]) * arrowLeft + y1[i] - (y2[i] - y1[i]) / (x2[i] - x1[i]) * x1[i]);
			else
				arrowTop += yCoord[i];
			
			var arrowTopLeft = document.elementFromPoint(arrowLeft, arrowTop);
			var arrowTopRight = document.elementFromPoint(arrowLeft + 32, arrowTop);
			var arrowBottomLeft = document.elementFromPoint(arrowLeft, arrowTop + 10);
			var arrowBottomRight = document.elementFromPoint(arrowLeft + 32, arrowTop + 10);

			if (!arrowTopLeft.classList.contains('blocking') && !arrowTopRight.classList.contains('blocking') &&
				!arrowBottomLeft.classList.contains('blocking') && !arrowBottomRight.classList.contains('blocking') &&
				!(arrowTop <= 10) && !(arrowLeft <= 0) && !((arrowTop + 20) >= window.innerHeight) && !((arrowLeft + 20) >= window.innerWidth) &&
				!arrowTopLeft.classList.contains('character') && !arrowTopRight.classList.contains('character') &&
				!arrowBottomLeft.classList.contains('character') && !arrowBottomRight.classList.contains('character')) {
			
				//Moves the arrow
				currentArrow.style.left = arrowLeft + 'px';
				currentArrow.style.top = arrowTop + 'px';
			} else {
				//Update the state arrow, which records if an arrow has become "stuck".
				arrowsState[i] = 1;
			}
			//Add "dead" animation to enemy, if found at these coordinates
			killEnemies(arrowTopLeft, arrowTopRight, arrowBottomLeft, arrowBottomRight);

			//remove the arrow if it has hit the player. Add hit animation to player and update score.
			if (detectCharacter(currentArrow, arrowLeft, arrowTop) == true) {
				removeArrow(i);
				hit();

			}
		}
	}
}


// Arrow movement
function setArrowDirection(chrct, arrowElement, i) {

	//For enemies facing left of right, shoot at an agle by setting up an equation
	if (chrct.classList.contains('enemy') && !chrct.classList.contains('down') && !chrct.classList.contains('up')) {
		x1[i] = chrct.offsetLeft;
		y1[i] = chrct.offsetTop;
		x2[i] = player.offsetLeft + player.offsetWidth / 2;
		y2[i] = player.offsetTop + player.offsetHeight / 2;
		var d1 = x2[i] - x1[i];
		var d2 = y2[i] - y1[i];
		var theta = Math.floor(180 * Math.atan2(d2, d1) / Math.PI);
		arrowElement.style.transform = 'rotate(' + theta + 'deg)';
	}

	//For all other enemies and the player, set the arrow and its moving pattern
	if (chrct.classList.contains('right')) {
		setPlayerDirection(arrowElement, 'right');
		arrowElement.style.top = (chrct.offsetTop + 16) + 'px';
		arrowElement.style.left = (chrct.offsetLeft + chrct.offsetWidth + 4) + 'px';
		//An arrow moving right will always be moving right by 1px and down by 0 px
		xCoord[arrowsLength] = 1;
		yCoord[arrowsLength] = 0;
	} else if (chrct.classList.contains('left')) {
		setPlayerDirection(arrowElement, 'left');
		arrowElement.style.top = (chrct.offsetTop + 16) + 'px';
		arrowElement.style.left = (chrct.offsetLeft - chrct.offsetWidth) + 'px';
		xCoord[arrowsLength] = -1;
		yCoord[arrowsLength] = 0;
	} else if (chrct.classList.contains('up')) {
		setPlayerDirection(arrowElement, 'up');
		arrowElement.style.top = (chrct.offsetTop - 45) + 'px';
		arrowElement.style.left = (chrct.offsetLeft) + 'px';
		xCoord[arrowsLength] = 0;
		yCoord[arrowsLength] = -1;
	} else if (chrct.classList.contains('down')) {
		setPlayerDirection(arrowElement, 'down');
		arrowElement.style.top = (chrct.offsetTop + 64) + 'px';
		arrowElement.style.left = (chrct.offsetLeft) + 'px';
		xCoord[arrowsLength] = 0;
		yCoord[arrowsLength] = 1;
	}
}


function enemyRandomise() {


	var enemyNo = enemies.length;

	//Generate 4 random numbers, as enemies array indexes. 3 will fire, 1 will hide.
	var randomNo = Math.floor(Math.random() * enemyNo);
	var randomFire1 = Math.floor(Math.random() * enemyNo);
	var randomFire2 = Math.floor(Math.random() * enemyNo);
	var randomFire3 = Math.floor(Math.random() * enemyNo);

	//All numbers must be different
	while (randomNo != randomFire1 && randomNo != randomFire2 && randomNo != randomFire3) randomNo = Math.floor(Math.random() * enemyNo);
	
	if (enemies.length > 0) {
		for (var i = 0; i < enemies.length; i++) {

			if (!enemies[i].classList.contains('dead')) {

				if (enemies[i].classList.contains('hide')) {
					//All enemies currently hiding will appear.
					enemies[i].classList.remove('hide');
					enemies[i].classList.add('appear');

				} else if ((i == randomFire1 || i == randomFire2 || i == randomFire3)) {

					//Enemies cannot spin around to shoot at the player.
					if ((enemies[i].classList.contains('left') && (player.offsetLeft + 64) < enemies[i].offsetLeft) ||
						(enemies[i].classList.contains('right') && player.offsetLeft > enemies[i].offsetLeft + 64) ||
						(enemies[i].classList.contains('down') && player.offsetTop > (enemies[i].offsetTop + 32)) ||
						(enemies[i].classList.contains('up') && (player.offsetTop + 32) < enemies[i].offsetTop))
					{
						//Add a new arrow.
						enemies[i].classList.add('fire');
						arrows.length++;
						arrowsLength++;
						arrows[arrowsLength] = document.createElement('div');
						body.appendChild(arrows[arrowsLength]);
						arrows[arrowsLength].classList.add('arrow');
						arrows[arrowsLength].style.opacity = 1;
						setArrowDirection(enemies[i], arrows[arrowsLength], arrowsLength);
					}
				}
			}
		}
	}
	//Hide 1 random enemy
	enemies[randomNo].classList.remove('appear');
	enemies[randomNo].classList.add('hide');
}

// Calls enemyRandomise() at every 2 calls. Removes the enemy bow.
function removeEnemyFire() {

	if (enemies.length > 0)
		for (var i = 0; i < enemies.length; i++)
			if (enemies[i].classList.contains('fire')) enemies[i].classList.remove('fire');

	if (enemyRandomisationState == 0) {
		enemyRandomise();
		enemyRandomisationState = 1;
	} else if (enemyRandomisationState == 1) enemyRandomisationState = 0;
}

//Calls the internal 3 methods at set intervals.
function moveMethod() {
	move();
	moveArrow();
	removeShotArrows();
}

//Calls the internal 3 methods at set intervals.
function allIntervals() {
	checkScore();
	checkHit();
	removeEnemyFire();
}

//Restarts all intervals (all motion) after a freeze screen (replay, restart, next level)
function setIntervals() {

	myMove = setInterval(moveMethod, 10);
	myIntervals = setInterval(allIntervals, 1000);
	myOpacity = setInterval(removeShotArrows, 250);
}

//Removes all animation from screen
function freezeScreen() {

	player.classList.remove('walk');
	player.classList.remove('fire');
	clearInterval(myFire);
	fireIntervalSet = true; 
	setPlayerDirection(player, 'stand');
	clearInterval(myMove);
	clearInterval(myIntervals);
	clearInterval(myOpacity);
}

//General use method for splicing an array and removing corresponding HTML element
function removeArrow(i) {

	var a = arrows[i];
	body.removeChild(a);
	arrows.splice(i, 1);
	xCoord.splice(i, 1);
	yCoord.splice(i, 1);

	arrowsState.splice(i, 1);

	x1.splice(i, 1);
	x2.splice(i, 1);
	y1.splice(i, 1);
	y2.splice(i, 1);

	arrowsLength = arrows.length - 1;
}

//Removes all "stuck" arrows that have reached 0 opacity
function removeShotArrows() {

	for (var i = 0; i < arrows.length; i++)

		if (arrowsState[i] == 1) {

			var aOpacity = parseFloat(arrows[i].style.opacity);
			aOpacity = aOpacity - 0.01;
			arrows[i].style.opacity = aOpacity;

			if (arrows[i].style.opacity == '0') {
				removeArrow(i);
			}
		}

}


//Checks if the number of lives has reached 0. If yes, it displays the lose scenario.
function hit() {

	player.classList.add('hit');

	if (playerLife > 0) {
		health[playerLife - 1].style.display = 'none';
		playerLife--;

		if (playerLife == 0 && score < enemies.length && level2 == false) {
			player.classList.add('dead');
			freezeScreen();
			losingMessage.style.display = 'flex';
			scoreP[1].firstChild.nodeValue = "enemy count : " + currentScore;
			losingMessage.style.left = (window.innerWidth / 2 - (losingMessage.offsetWidth / 2)) + 'px';
			losingMessage.style.top = (window.innerHeight / 2 - (losingMessage.offsetHeight / 2)) + 'px';
		} else if (level2 == true && score < enemies.length && playerLife == 0) {
			player.classList.add('dead');
			freezeScreen();
			losingMessageGame.style.display = 'flex';
			scoreP[3].firstChild.nodeValue = "enemy count : " + currentScore;
			losingMessageGame.style.left = (window.innerWidth / 2 - (losingMessageGame.offsetWidth / 2)) + 'px';
			losingMessageGame.style.top = (window.innerHeight / 2 - (losingMessageGame.offsetHeight / 2)) + 'px';
		}
	}
}

//Removes hit animation 
function checkHit() {
	if (player.classList.contains('hit')) {
		player.classList.remove('hit');

	}
}

//Increments score. Check is maximum score has been reached. If yes, displays win scenario.
function checkScore() {
	for (var i = 0; i < enemies.length; i++)
		if (enemies[i].classList.contains('dead')) score++;

	if (score == enemies.length && scoreReached == false && playerLife != 0 && level2 == false) {
		freezeScreen();
		winningMessage.style.display = 'flex';
		winningMessage.style.left = (window.innerWidth / 2 - (winningMessage.offsetWidth / 2)) + 'px';
		winningMessage.style.top = (window.innerHeight / 2 - (winningMessage.offsetHeight / 2)) + 'px';
		scoreReached = true;
		scoreP[0].firstChild.nodeValue = "enemy count : " + score;
	} else if (score == enemies.length && level2 == true && playerLife != 0 && scoreReached == false) {
		freezeScreen();
		winningMessageGame.style.display = 'flex';
		winningMessageGame.style.left = (window.innerWidth / 2 - (winningMessageGame.offsetWidth / 2)) + 'px';
		winningMessageGame.style.top = (window.innerHeight / 2 - (winningMessageGame.offsetHeight / 2)) + 'px';
		scoreReached = true;
		scoreP[2].firstChild.nodeValue = "enemy count : " + score;
	} else {
		currentScore = score;
		score = 0;
	}
}

//"Repaints" the game area: reinitalises everything, deletes arrows, removes dead animations fromt he enemies, resets intervals.
function replay() {


	winningMessage.style.display = 'none';
	losingMessage.style.display = 'none';
	winningMessageGame.style.display = 'none';
	losingMessageGame.style.display = 'none';


	for (var i = 0; i < enemies.length; i++) {
		enemies[i].classList.remove('dead');
	}
	i = 0;
	while (arrows.length > 0) removeArrow(i);
	arrowsLength = -1;
	arrows.length = 0;
	x1.length = 0;
	x2.length = 0;
	y1.length = 0;
	y2.length = 0;
	arrowsState.length = 0;

	player.classList.remove('dead');
	player.classList.remove('hit');
	setPlayerDirection(player, 'down');
	player.style.left = '200px';
	player.style.top = '200px';

	playerLife = 3;
	for (i = 0; i < 3; i++)
		health[i].style.display = 'block';
	score = 0;
	scoreReached = false;
	currentScore = 0;

	setIntervals();
	fireIntervalSet = false;
}

/** Deletes all enemies and places new ones in different positions 
* (could just relocate existing ones if the same number of enemies is kept)
*/
function continueToNextLevel() {

	replay();
	level2 = true;

	var i = 0;
	while (i < enemies.length) {
		var e = enemies[i];
		body.removeChild(e);
	}
	enemies.length = 0;


	for (i = 0; i < 9; i++) {
		var x = document.createElement('div');
		
		x.classList.add('enemy');
		x.classList.add('grey');
		x.classList.add('stand');
		x.classList.add('appear');

		var y = document.createElement('div');
		y.classList.add('head');

		var z = document.createElement('div');
		z.classList.add('body');
		
		var w = document.createElement('div');
		w.classList.add('weapon');
		w.classList.add('bow');
	
		body.appendChild(x);
		x.appendChild(y);
		x.appendChild(z);
		x.appendChild(w);

		if (i == 0) {
			x.style.left = '10vw';
			x.style.top = '0.5vh';
			x.classList.add('down');
		}
		if (i == 1) {
			x.style.left = '32vw';
			x.style.top = (window.innerHeight / 2 - 110) + 'px';
			x.classList.add('left');
		}
		if (i == 2) {
			x.style.left = '0px';
			x.style.top = (window.innerHeight / 2) + 'px';
			x.classList.add('right');
		}
		if (i == 3) {
			x.style.left = '20vw';
			x.style.top = (window.innerHeight - 70) + 'px';
			x.classList.add('up');
		}
		if (i == 4) {
			x.style.left = (window.innerWidth / 2 - 120) + 'px';
			x.style.top = '0.5vh';
			x.classList.add('down');
		}
		if (i == 5) {
			x.style.left = '80vw';
			x.style.top = '60vh';
			x.classList.add('left');
		}
		if (i == 6) {
			x.style.left = '62vw';
			x.style.top = (window.innerHeight - 70) + 'px';
			x.classList.add('up');
		}
		if (i == 7) {
			x.style.left = '68vw';
			x.style.top = '0.5vh';
			x.classList.add('down');
		}
		if (i == 8) {
			x.style.left = '80vw';
			x.style.top = '30vh';
			x.classList.add('left');
		}
	}
	enemies = document.getElementsByClassName('enemy');
}

//Reloads page
function restart() {
	document.location.reload();
}

//Sets the player facing up down right or left
function setPlayerDirection(player, dir) {
	player.classList.remove('up');
	player.classList.remove('left');
	player.classList.remove('right');
	player.classList.remove('down');

	player.classList.add(dir);
}



function move() {
	var left = player.offsetLeft;
	var top = player.offsetTop;

	if (downPressed) {
		setPlayerDirection(player, 'down');
		top = top + 1;
	}

	if (upPressed) {
		setPlayerDirection(player, 'up');
		top = top - 1;
	}

	if (leftPressed) {
		setPlayerDirection(player, 'left');
		left = left - 1;
	}

	if (rightPressed) {
		setPlayerDirection(player, 'right');
		left = left + 1;
	}

	var playerTopLeft = document.elementFromPoint(left, top);
	var playerTopRight = document.elementFromPoint(left + 32, top);
	var playerBottomLeft = document.elementFromPoint(left, top + 48);
	var playerBottomRight = document.elementFromPoint(left + 32, top + 48);



	if (!playerTopLeft.classList.contains('blocking') && !playerTopRight.classList.contains('blocking') &&
		!playerBottomLeft.classList.contains('blocking') && !playerBottomRight.classList.contains('blocking') &&
		!playerTopLeft.classList.contains('arrow') && !playerTopRight.classList.contains('arrow') &&
		!playerBottomLeft.classList.contains('arrow') && !playerBottomRight.classList.contains('arrow'))
	{
		player.style.left = left + 'px';
		player.style.top = top + 'px';
	}


	//If any of the keys are being pressed, display the walk animation
	if (leftPressed || rightPressed || upPressed || downPressed) {
		player.classList.add('walk');
		player.classList.remove('stand');
	}
	//Otherwise, no keys are being pressed, display stand
	else {
		player.classList.add('stand');
		player.classList.remove('walk');
	}
}

function keyUp(event) {
	if (event.keyCode == 37) {
		leftPressed = false;
	}

	if (event.keyCode == 39) {
		rightPressed = false;
	}

	if (event.keyCode == 38) {
		upPressed = false;
	}

	if (event.keyCode == 40) {
		downPressed = false;
	}
	if (event.keyCode == 32) {
		spacePressed = false;
		player.classList.remove('fire');
	}
	if (event.keyCode == 81) {
		player.classList.remove('hit');
	}
}

function keyDown(event) {
	if (event.keyCode == 37) {
		leftPressed = true;
	}

	if (event.keyCode == 39) {
		rightPressed = true;
	}

	if (event.keyCode == 38) {
		upPressed = true;
	}

	if (event.keyCode == 40) {
		downPressed = true;
	}

	//Sets a new interval on every space press
	if (event.keyCode == 32) {

		if (fireIntervalSet == false) {
			myFire = setInterval(fire, 500);
			fireIntervalSet = true;
		}
		spacePressed = true;
	}
	if (event.keyCode == 81) {
		player.classList.add('hit');
	}

}

//Limtis firing range on screen.
function allowFire() {

	if ((player.offsetLeft < 33 && player.classList.contains('left')) || (player.offsetTop < 33 && player.classList.contains('up')) || (player.offsetTop > window.innerHeight - 75 && player.classList.contains('down')))
		return false;
	else return true;
}

//Limits firing frequency at 2/second. Clears the interval set in keyDown every time it is called.
function fire() {

	if (spacePressed && allowFire()) {
		player.classList.add('fire');
		var x = document.createElement('div');
		body.appendChild(x);
		x.classList.add('arrow');
		arrowsState.push(0);
		arrows.push(x);
		arrowsLength++;
		setArrowDirection(player, arrows[arrowsLength], arrowsLength);
		arrows[arrowsLength].style.opacity = 1;
	}
	if (fireIntervalSet == true) {
		clearInterval(myFire);
		fireIntervalSet = false;
	}

}


//Character head selection
function changeHead() {

	element = document.getElementsByClassName('head');
	element[0].style.backgroundImage = 'url(images/' + this.id + '.png)';

}
//Character body selection
function changeBody() {
	element = document.getElementsByClassName('body');
	element[0].style.backgroundImage = 'url(images/' + this.id + '.png)';

}
//Opens the sidebar when the player is clicked.
function openSidebar() {
	var x = document.getElementsByTagName('aside');
	x[0].style.marginLeft = '-240px';
	x[0].style.transition = 'all 1s';
	//selectedPlayer=1;
}
//Closes the sidebar when the player is clicked.
function closeSidebar() {
	x = document.getElementsByTagName('aside');
	x[0].style.marginLeft = '20px';
	x[0].style.transition = 'all 1s';
}

function toggleMusic() {
	var audio = document.getElementsByTagName('audio');
	if (state == 0) {
		audio[0].pause();
		sound.style.backgroundImage = 'url(images/off.png)';
		state = 1;
	} else {
		audio[0].play();
		sound.style.backgroundImage = 'url(images/on.png)';
		state = 0;
	}
}

//Centres and displays the About message on screen
function handleAbout() {
	exitHelp();
	var about = document.getElementsByClassName('about');
	about[0].style.display = 'block';
	about[0].style.left = (window.innerWidth / 2 - (about[0].offsetWidth / 2)) + 'px';
	about[0].style.top = (window.innerHeight / 2 - (about[0].offsetHeight / 2)) + 'px';
}

//Centres and displays the Help menu on screen
function handleHelp() {
	exitAbout();
	var help = document.getElementsByClassName('help');
	help[0].style.display = 'block';
	help[0].style.left = (window.innerWidth / 2 - (help[0].offsetWidth / 2)) + 'px';
	help[0].style.top = (window.innerHeight / 2 - (help[0].offsetHeight / 2)) + 'px';
}

//Exits the about menu
function exitAbout() {
	var x = document.getElementsByClassName('about');
	x[0].style.display = 'none';
}

//Exits the help menu
function exitHelp() {
	var x = document.getElementsByClassName('help');
	x[0].style.display = 'none';
}

//Sets up click events for the aside tag
function setAside() {
	var classHeads = document.getElementsByClassName('heads');
	var elements = classHeads[0].getElementsByTagName('li');
	for (var j = 0; j < elements.length; j++)
		elements[j].addEventListener('click', changeHead);


	var classBodies = document.getElementsByClassName('bodies');
	var elements = classBodies[0].getElementsByTagName('li');
	for (j = 0; j < elements.length; j++)
		elements[j].addEventListener('click', changeBody);

	x = document.getElementById('player');
	x.addEventListener('click', openSidebar);
	x = document.getElementById('closeside');
	x.addEventListener('click', closeSidebar);

	x = document.getElementById('about');
	x.addEventListener('click', handleAbout);
	x = document.getElementById('help');
	x.addEventListener('click', handleHelp);
	x = document.getElementById('exitAbout');
	x.addEventListener('click', exitAbout);
	x = document.getElementById('exitHelp');
	x.addEventListener('click', exitHelp);
}

function gameStart() {
	
	//Music 
	state = 0;
	sound = document.getElementById('sound');
	sound.addEventListener('click', toggleMusic);

	//Win and lose scenarios
	var x = document.getElementsByClassName('winningMessage');
	winningMessage = x[0];
	x = document.getElementsByClassName('losingMessage');
	losingMessage = x[0];
	x = document.getElementsByClassName('winningMessageGame');
	winningMessageGame = x[0];
	x = document.getElementsByClassName('losingMessageGame');
	losingMessageGame = x[0];

	//General initialisations
	playerLife = 3;
	var y = document.getElementsByClassName('health');
	lives = y[0];
	health = lives.getElementsByTagName('li');
	body = document.getElementsByTagName('body')[0];
	player = document.getElementById('player');
	enemies = document.getElementsByClassName('enemy');

	//Arrows initialisations
	arrowsLength = -1;

	//Score and Score display box button listeners
	score = 0;
	scoreReached = false;
	scoreP = document.getElementsByClassName('score');

	//Button listeners
	x = document.getElementsByClassName('settingsButton');
	for (var i = 0; i < x.length; i++) {
		x[i].addEventListener('click', openSidebar);
	}

	x = document.getElementsByClassName('continueButton');
	for (i = 0; i < x.length; i++) {
		x[i].addEventListener('click', continueToNextLevel);
	}

	x = document.getElementsByClassName('replayButton');
	for (var i = 0; i < x.length; i++) {
		x[i].addEventListener('click', replay);
	}

	x = document.getElementsByClassName('restartButton');
	for (var i = 0; i < x.length; i++) {
		x[i].addEventListener('click', restart);
	}

	//INTERVALS
	myMove = setInterval(moveMethod, 10);
	myIntervals = setInterval(allIntervals, 1000);

	//Key listeners 
	document.addEventListener('keydown', keyDown);
	document.addEventListener('keyup', keyUp);

	//Aside 
	setAside();


}

document.addEventListener('DOMContentLoaded', gameStart);