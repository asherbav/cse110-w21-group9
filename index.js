// Time in milliseconds
const SHORT_BREAK_DURATION = 5*1000;
const LONG_BREAK_DURATION = 10*1000;
const WORK_DURATION = 15*1000;
const UPDATE_TIMER_EVERY = 200;

const LONG_BREAK_EVERY = 4;

let time, timerEnd, ID;
let breakCount = 0;

const SESSION_STATUS = {
    incomplete: 0,
    complete: 1,
    deleted: 2
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
        SESSION_STATUS.deleted
}
*/
let currentPomoID = -1;

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

/**
 * Log the distractions for the currently running pomo
 */
function logDistraction(pomoId) {
	pomoData[pomoId].distractions++;
}

function setName(pomoId, pomoName) {
	pomoData[pomoId].taskName = pomoName;
}

function setStatus(pomoId, pomoStatus) {
	pomoData[pomoId].sessionStatus = pomoStatus;
}

function getPomo() {
    return pomoData;
}

function getPomoById(pomoId) {
    return pomoData[pomoId];
}

function getCurrentPomoId() {
    return currentPomoID;
}

function setPomo(pomoId){
    currentPomoID = pomoId;
}

/**
 * Called by the timer when the break is complete
 * TODO: implement what should happen when the break timer is finished
 */
function finishBreak() {
	console.warn("Break finished");
}

/**
 * Called by the timer when the pomo is complete, starts the break timer
 * TODO: Implement the what should happen when the pomo timer is finished
 */
function finishPomo() {
	console.warn("Pomo finished");
	if(breakCount++ % LONG_BREAK_EVERY == 0) startLongBreakTimer();
	else startShortBreakTimer();
}

/**
 * Cancels the currently running pomo
 * TODO: for now this only stops the timer, needs to call the UI functions too
 */
function cancelPomo() {
	timerEnd = time - 1;
}

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
	if(time >= timerEnd) {
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
	if(time >= timerEnd) {
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
}

/**
 * Called when we want to start the long break
 */
function startLongBreakTimer() {
	time = Date.now();
	timerEnd = time + LONG_BREAK_DURATION;
	setTimeout(refreshBreakTimer, UPDATE_TIMER_EVERY);
}

function setBreakTimer(time) {
	document.getElementById('break-timer').innerHTML = time;
}

function setPomoTimer(time) {
	document.getElementById('pomo-timer').innerHTML = time;
}

/**
 * Set pomodoro id
 * @param {The unique ID for the pomodoro} pomoId 
 */
function setCurrentPomo(pomoId) {
	ID = pomoId;
}

/**
 * Returns pomodoro id variable
 */
function getCurrentPomo() {
	return ID;
}

/**
 * Called when user presses start pomo, loads that pomo and goes to the timer page
 */
function startPomo(pomoId) {
	let mainpage = document.getElementById('main-page');
	let timerpage = document.getElementById('timer-page');
	mainpage.style.display = 'none';
	timerpage.style.display = 'block';
	setCurrentPomo(pomoId);
	startPomoTimer();
}

/**
 * Called when the user presses finish session on the table
 */
function finishSession() {

}

/**
 * Called whenever the user updates something about the pomodoro (status, changes description, etc) and handles it
 * Is this for localStorage?
 */
function updatePomo()  {

}

/**
 * Called when user presses add task button.
 * Adds task to the table
 */
function addTask() {
	let table = document.getElementById('table');

	//Inputs
	let inputEstimate = document.getElementById('estimate');
	let inputDesc = document.getElementById('task-description');

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
	
	//Column Content
	let btnCont = document.createElement('button');
	btnCont.innerHTML = 'Remove';
	btnCont.className = 'remove-btn';
	btnCont.addEventListener('click', function () {
		row.style.display = 'none';
	});
		
	let descCont = document.createElement('p');
	descCont.innerHTML = inputDesc.value;

	let estCont = document.createElement('p');
	estCont.innerHTML = inputEstimate.value;

	let actualCont = document.createElement('p');
	actualCont.innerHTML = "0";

	let distractCont = document.createElement('p');
	distractCont.innerHTML = "0";

	let sessionCont = document.createElement('select');
	let firstOption = document.createElement('option');
	firstOption.value = 'incomplete';
	firstOption.innerHTML = 'Incomplete';
	let secondOption = document.createElement('option');
	secondOption.value = 'complete';
	secondOption.innerHTML = 'Complete';
	sessionCont.appendChild(firstOption);
	sessionCont.appendChild(secondOption);

	

	let startCont = document.createElement('button');
	startCont.innerHTML = 'Start';
	startCont.addEventListener('click', startPomo('1'));

	//Appending Column Content to Columns
	removeBtn.appendChild(btnCont);
	desc.appendChild(descCont);
	estimate.appendChild(estCont);
	actual.appendChild(actualCont);
	distract.appendChild(distractCont);
	sessionStatus.appendChild(sessionCont);
	start.appendChild(startCont);

	//Appending Columns to Rows
	row.appendChild(removeBtn);
	row.appendChild(desc);
	row.appendChild(estimate);
	row.appendChild(actual);
	row.appendChild(distract);
	row.appendChild(sessionStatus);
	row.appendChild(start);

	table.appendChild(row);

	//Clears values
	inputDesc.value = '';
	inputEstimate.value = '';
}

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
catch(err) {
	// Do nothing
}