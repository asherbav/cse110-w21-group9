// Time in milliseconds
const SHORT_BREAK_DURATION = 10 * 1000;
const LONG_BREAK_DURATION = 1 * 1000;
const WORK_DURATION = 1 * 1000;
const UPDATE_TIMER_EVERY = 200;

const LONG_BREAK_EVERY = 4;
const INVALID_POMOID = -1;

let time, timerEnd;
let breakCount = 0;

let previousState;

let cancelTimerFlag = 0;

const SESSION_STATUS = {
	incomplete: 0,
	complete: 1,
	deleted: 2,
	inprogress: 3
};

let pomoData = [];
/*
{
	taskName: "task name",
	  estimatedPomos: number,
	actualPomos: number,
	distractions, 
	sessionStatus: one of:
		SESSION_STATUS.incomplete,
		SESSION_STATUS.complete,
		SESSION_STATUS.deleted,
    SESSION_STATUS.inprogress
}
*/
let currentPomoID = INVALID_POMOID;

// UNUSED
function setName(pomoId, pomoName) {
	pomoData[pomoId].taskName = pomoName;
}

// UNUSED
function setStatus(pomoId, pomoStatus) {
	pomoData[pomoId].sessionStatus = pomoStatus;
}

// UNUSED
function getPomoData() {
	return pomoData;
}


function getPomoById(pomoId) {
	return pomoData[pomoId];
}

//UNUSED  
function getCurrentPomoId() {
	return currentPomoID;
}

/**
* Sets current pomo variable to a given pomo Id, used for starting and cancelling pomo
*/
function setPomo(pomoId) {
	currentPomoID = pomoId;
}

/**
 * Set pomodoro id
 * @param {The unique ID for the pomodoro} pomoId 
 */
function setCurrentPomo(pomoId) {
	currentPomoID = pomoId;
}

//UNUSED
/**
 * Returns pomodoro id variable
 */
function getCurrentPomo() {
	return currentPomoID;
}

/**
 * Function to create a pomodoro
 */
function createPomodoro(taskName, estimatedPomos) {
	let pomo = {
		"id": pomoData.length,
		"taskName": taskName,
		"estimatedPomos": estimatedPomos,
		"actualPomos": 0,
		"distractions": 0,
		"sessionStatus": SESSION_STATUS.incomplete
	};
	pomoData.push(pomo);
	return pomo.id;
}

/* FLOW CONTROL */

/**
 * Called when user presses start pomo, loads that pomo and goes to the timer page
 */
function startPomo(pomoId) {
	let mainpage = document.getElementById('main-page');
	let timerpage = document.getElementById('timer-page');
	mainpage.style.display = 'none';
	timerpage.style.display = '';
	setPomo(pomoId);
	setCurrentPomo(pomoId);
	let desc = document.getElementById('task');
	desc.innerHTML = "Current Task: " + getPomoById(pomoId).taskName;
	startPomoTimer();
	previousState = JSON.parse(JSON.stringify(getPomoById(pomoId)));
	getPomoById(pomoId).actualPomos++;
	setStatus(pomoId, SESSION_STATUS.inprogress);
}


/**
 * Called by the timer when the pomo is complete, starts the break timer
 * TODO: Implement the what should happen when the pomo timer is finished
 */
function finishPomo() {
	console.warn("Pomo finished");
	let mainpage = document.getElementById('main-page');
	let timerpage = document.getElementById('timer-page');
	mainpage.style.display = '';
	timerpage.style.display = 'none';
	let panel = document.getElementById("cancel-button-dialog");
	panel.close();
	updateTable();
	if (cancelTimerFlag == 1) {
		cancelTimerFlag = 0;
	}
	else {
		document.getElementById('timer-audio').play();
		showBreakTimer();
		if (++breakCount % LONG_BREAK_EVERY == 0) startLongBreakTimer();
		else startShortBreakTimer();
	}
}

/******** TIMER FUNCTIONS *******/

/**
 * Called when we want to start the pomodoro timer
 */
function startPomoTimer() {
	time = Date.now();
	timerEnd = time + WORK_DURATION;
	setTimeout(refreshPomoTimer, UPDATE_TIMER_EVERY);
}

/**
 * Refreshes the pomo timer, checks how much time is left, 
 * and if we are finished
 */
function refreshPomoTimer() {
	time = Date.now();
	if (time >= timerEnd) {
		setPomoTimer("00:00");
		finishPomo();
	} else {
		let dTime = new Date(timerEnd - time);
		setPomoTimer(getTimeString(dTime));
		setTimeout(refreshPomoTimer, UPDATE_TIMER_EVERY);
	}
}

/**
 * Get a formatted time string from a date object
 * MM:SS
 */
function getTimeString(dObj) {
	return ('0' + dObj.getMinutes()).slice(-2) + ":" + ('0' + dObj.getSeconds()).slice(-2)
}

/**
 * Refreshes the break timer, checks how much time is left, 
 * and if we are finished
 */
function refreshBreakTimer() {
	time = Date.now();
	if (time >= timerEnd) {
		setBreakTimer("00:00");
		finishBreak();
	} else {
		let dTime = new Date(timerEnd - time);
		setBreakTimer(getTimeString(dTime));
		setTimeout(refreshBreakTimer, UPDATE_TIMER_EVERY);
	}
}

/**
 * Called when we want to start the short break
 */
function startShortBreakTimer() {
	time = Date.now();
	timerEnd = time + SHORT_BREAK_DURATION;
	setTimeout(refreshBreakTimer, UPDATE_TIMER_EVERY);
	updateTable(true);
	let buttons = document.getElementsByTagName("button");
	for (let i = 0; i < buttons.length; i++) {
		let button = buttons[i];
		button.setAttribute('disabled', 'disabled')
	}
}

/**
 * Called when we want to start the long break
 */
function startLongBreakTimer() {
	time = Date.now();
	timerEnd = time + LONG_BREAK_DURATION;
	setTimeout(refreshBreakTimer, UPDATE_TIMER_EVERY);
	updateTable(true);
  let buttons = document.getElementsByTagName("button");
	for (let i = 0; i < buttons.length; i++) {
		let button = buttons[i];
		button.setAttribute('disabled', 'disabled');
  }
}

function setBreakTimer(time) {
	document.getElementById('break-timer').innerHTML = time;
}

function setPomoTimer(time) {
	document.getElementById('pomo-timer').innerHTML = time;
}

/**
 * Called by the timer when the break is complete
 * TODO: implement what should happen when the break timer is finished
 */
function finishBreak() {
	document.getElementById('timer-audio').play();
	hideBreakTimer();
	console.warn("Break finished");
	alert('Break over');
	let buttons = document.getElementsByTagName("button");
	for (let i = 0; i < buttons.length; i++) {
		let button = buttons[i];
		button.disabled = false;
	}
	updateTable();
}

/****** UI ******/

/**
 * Log the distractions for the currently running pomo
 */
function logDistraction(pomoId) {
	pomoData[pomoId].distractions++;
}

/**
 * shows html element of break timer on the page
 */
function showBreakTimer() {
	document.getElementById('break-screen').style.display = 'flex';
}

/**
 * hides html element of break timer on the page
 */
function hideBreakTimer() {
	document.getElementById('break-screen').style.display = 'none';
}


/**
 * Cancels the currently running pomo
 * TODO: for now this only stops the timer, needs to call the UI functions too
 */
function cancelPomo() {
	let panel = document.getElementById("cancel-button-dialog");
	timerEnd = time - 1;
	pomoData[currentPomoID] = previousState;
	cancelTimerFlag = 1;

	panel.close();
	if (pomoData[currentPomoID].actualPomos == 0){
		pomoData[currentPomoID].sessionStatus = SESSION_STATUS.incomplete;
		setPomo(INVALID_POMOID);
	}
	updateTable();

}

/**
 * Sets a task as finished
 */
function finishTask(pomoID) {
	setStatus(pomoID, SESSION_STATUS.complete);
	setCurrentPomo(INVALID_POMOID);
	updateTable();
}

/***** TABLE ******/

/**
 * Redraw table
 */
function updateTable(disableAllStarts = false) {
	let table = document.getElementById('table');
	table.innerHTML = '<tr><th>Remove</th><th>Task</th><th>Estimated Pomos</th><th>Actual Pomos</th><th>Distractions</th><th>Status</th><th>Start Session</th><th>Finish Task</th></tr>';

	let done = [];
	let notDone = [];
	let inprogress = [];
	for (let i = 0; i < pomoData.length; i++) {
		if (pomoData[i].sessionStatus == SESSION_STATUS.inprogress)
			inprogress.push(pomoData[i]);
		else if (pomoData[i].sessionStatus == SESSION_STATUS.incomplete)
			notDone.push(pomoData[i]);
		else if (pomoData[i].sessionStatus == SESSION_STATUS.complete)
			done.push(pomoData[i]);
	}

	toDraw = inprogress.concat(notDone).concat(done);
	for (let i = 0; i < pomoData.length; i++) {
		//Row Container
		let row = document.createElement('tr');

		//Column Containers
		let removeBtn = document.createElement('td');
		let desc = document.createElement('td');
		let estimate = document.createElement('td');
		let actual = document.createElement('td');
		let distract = document.createElement('td');
		let sessionStatus = document.createElement('td');
		let start = document.createElement('td');
		let fin = document.createElement('td');

		//Column Content
		let btnCont = document.createElement('button');
		btnCont.innerHTML = 'X';
		btnCont.className = 'remove-btn';
		btnCont.addEventListener('click', function () {
      removeTask(toDraw[i].id)
    });
		if (toDraw[i] != undefined && toDraw[i].sessionStatus == SESSION_STATUS.inprogress) {
			btnCont.setAttribute('disabled', 'disabled');
		}

		let descCont = document.createElement('p');
		descCont.innerHTML = toDraw[i].taskName;

		let estCont = document.createElement('p');
		estCont.innerHTML = toDraw[i].estimatedPomos;

		let actualCont = document.createElement('p');
		actualCont.innerHTML = toDraw[i].actualPomos;

		let distractCont = document.createElement('p');
		distractCont.innerHTML = toDraw[i].distractions;

		let sessionCont = document.createElement('p');
		switch (toDraw[i].sessionStatus) {
			case SESSION_STATUS.incomplete:
				sessionCont.innerHTML = "Not Started";
				sessionCont.className = "status-not-started";
				break;
			case SESSION_STATUS.inprogress:
				sessionCont.innerHTML = "In Progress";
				sessionCont.className = "status-in-progress";
				break;
			case SESSION_STATUS.complete:
				sessionCont.innerHTML = "Complete";
				sessionCont.className = "status-complete";
		}

		let newID = toDraw[i].id;

		let startCont = document.createElement('button');
		startCont.className = 'start-btn';
		startCont.id = "start-btn-" + newID;
		startCont.innerHTML = 'Start';
		startCont.setAttribute('onclick', 'startPomo(' + newID + ')');
		if ((currentPomoID != INVALID_POMOID && currentPomoID != newID) || disableAllStarts || toDraw[i].sessionStatus == SESSION_STATUS.complete) {
			startCont.setAttribute('disabled', 'disabled');
		}

		let finCont = document.createElement('button');
		finCont.className = 'finish-btn';
		finCont.id = "finish-btn-" + newID;
		finCont.innerHTML = 'Finish';
		finCont.setAttribute('onclick', 'finishTask(' + newID + ')');
		if ((currentPomoID != INVALID_POMOID && currentPomoID != newID) || toDraw[i].sessionStatus == SESSION_STATUS.complete || toDraw[i].sessionStatus == SESSION_STATUS.incomplete) {
			finCont.setAttribute('disabled', 'disabled');
		}

		//Appending Column Content to Columns
		removeBtn.appendChild(btnCont);
		desc.appendChild(descCont);
		estimate.appendChild(estCont);
		actual.appendChild(actualCont);
		distract.appendChild(distractCont);
		sessionStatus.appendChild(sessionCont);
		start.appendChild(startCont);
		fin.appendChild(finCont);

		//Appending Columns to Rows
		row.appendChild(removeBtn);
		row.appendChild(desc);
		row.appendChild(estimate);
		row.appendChild(actual);
		row.appendChild(distract);
		row.appendChild(sessionStatus);
		row.appendChild(start);
		row.appendChild(fin);

		table.appendChild(row);
	}
}

/**** TABLE BUTTONS ****/
/**
 * Called when user presses add task button.
 * Adds task to the table
 */
function addTask() {
	// let table = document.getElementById('table');

	// //Inputs
	let inputEstimate = document.getElementById('estimate');
	let inputDesc = document.getElementById('task-description');

	// //Clears values
	let newID = createPomodoro(inputDesc.value, inputEstimate.value);
	updateTable();
	inputDesc.value = '';
	inputEstimate.value = '';
	return false;
}

function removeTask(pomoId){
  pomoData[pomoId].sessionStatus = SESSION_STATUS.deleted;
	updateTable();
}


/**** DIALOG ******/

function displayCancelDialog() {
	let panel = document.getElementById("cancel-button-dialog");
	panel.showModal();
}

function closeCancelDialog() {
	let panel = document.getElementById("cancel-button-dialog");
	panel.close();
}

function closeRemoveDialog() {
	let panel = document.getElementById("remove-button-dialog");
	panel.close();
}

function displayFinishDialog() {
	let panel = document.getElementById("finish-button-dialog");
	panel.showModal();
}

function closeFinishDialog() {
	let panel = document.getElementById("finish-button-dialog");
	panel.close();
}

/***** ONLOAD *******/
window.onload = function () {
	updateTable();
	document.getElementById('add-task-form').addEventListener('submit', (event) => {
		event.preventDefault();
	})
};

try {
	// If we are running in a test environment
	module.exports = {
		SHORT_BREAK_DURATION: SHORT_BREAK_DURATION,
		LONG_BREAK_EVERY: LONG_BREAK_EVERY,
		LONG_BREAK_DURATION: LONG_BREAK_DURATION,
		WORK_DURATION: WORK_DURATION,
		UPDATE_TIMER_EVERY: UPDATE_TIMER_EVERY,
		time: time,
		timerEnd: timerEnd,
		getTimeString: getTimeString,
		startPomoTimer: startPomoTimer,
		finishBreak: finishBreak,
		startLongBreakTimer: startLongBreakTimer,
		startShortBreakTimer: startShortBreakTimer,
		refreshBreakTimer: refreshBreakTimer,
		finishPomo: finishPomo,
	};
}
catch (err) {
	// Do nothing
}