/* 
createPomodoro, X
logDistraction, X
setName, X
setStatus, X
getPomo, X
getCurrentPomoId X, 
setPomo X, 
getPomoById X,
finishBreak - check that buttons are disabled,
finishPomo - TBD,
startPomoTimer - TBD,
refreshPomoTimer - Check if time resets after work time is done and check if time changes every second,
getTimeString - Create a test date object and compare to expected time string, X
refreshBreakTimer - Same as refreshPomoTimer,
startShortBreakTimer - Check if buttons are disabled during break,
startLongBreakTimer - Check if startLongBreakTimer is called when pomoCount % 4 = 0,
setBreakTimer - Check if break time is changed in the html, X
setPomoTimer - Check if pomo time is changed in the html, X
setCurrentPomo - Check value of currentPomoID, X
getCurrentPomo - Check if currentPomoID matches the function return, X
finishTask - Not Used,
startPomo - Not Used,
updatePomo - Not Used,
updateTable - Update the table then compare values from pomoData to confirm they match
addTask - Compare task row in the table to task in pomoData
*/
const index = require("./index.js");
const fs = require("fs");
const path = require("path");
const { currentPomoID, getCurrentPomoId, SESSION_STATUS, previousState } = require("./index.js");
const html = fs.readFileSync("./index.html", "utf8");

jest.dontMock("fs");

jest.useFakeTimers();

describe("data storage tests", () => {
  test("create pomodoro test", () => {
    index.createPomodoro("test task", 4);
    expect(JSON.stringify(index.pomoData[0])).toBe(
      JSON.stringify({
        id: 0,
        taskName: "test task",
        estimatedPomos: 4,
        actualPomos: 0,
        distractions: 0,
        sessionStatus: index.SESSION_STATUS.incomplete,
      })
    );
  });

  test("log distraction test", () => {
    index.logDistraction(0);
    expect(index.pomoData[0].distractions).toBe(1);
  });

  test("set pomo status test", () => {
    index.setStatus(0, 1);
    expect(index.pomoData[0].sessionStatus).toBe(1);
  });

  test("set pomo name test", () => {
    index.setName(0, "updated test task");
    expect(index.pomoData[0].taskName).toBe("updated test task");
  });

  test("set/get current pomo test", () => {
    index.setPomo(-1);
    expect(index.getCurrentPomoId()).toBe(-1);
  });

  test("get pomo by id", () => {
    index.createPomodoro("test1", 1);
    expect(index.getPomoById(1).taskName).toBe("test1");
  });

});

describe("index.js tests", () => {
  // Before each test, create an instance of the html page.
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    jest.resetModules();
  });

  test("set break timer test", () => {
    document.body.innerHTML = '<p id="break-timer" class="break-timer"></p>';
    const bTimer = document.getElementById("break-timer");
    index.setBreakTimer("8:00");
    expect(bTimer.innerHTML).toBe("8:00");
  });

  test("set pomo timer test", () => {
    document.body.innerHTML = '<p class="timer" id="pomo-timer"></p>';
    const pTimer = document.getElementById("pomo-timer");
    index.setPomoTimer("25:00");
    expect(pTimer.innerHTML).toBe("25:00");
  });

  test("set current Pomo test", () => {
    index.setCurrentPomo(-1);
    expect(index.currentPomoID).toBe(-1);
  });

  test("get current Pomo test", () => {
    let tempID = index.getCurrentPomoId();
    expect(tempID).toBe(-1);
  });

  test("finish break", () => {
    window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
    index.finishBreak();
    let removeButtons = document.getElementsByClassName("remove-btn");
    let startButtons = document.getElementsByClassName("start-btn");
    let finishButtons = document.getElementsByClassName("finish-btn");
    expect(removeButtons[0].disabled).toBe(false);
    expect(startButtons[0].disabled).toBe(false);
    expect(finishButtons[0].disabled).toBe(true);
    for(let i = 1; i < removeButtons.length; i++) {
      expect(removeButtons[i].disabled).toBe(false);
      expect(startButtons[i].disabled).toBe(true);
      expect(finishButtons[i].disabled).toBe(true);
    }
  });

  test("start pomo test", () => {
    index.createPomodoro("test task", 4);
    index.startPomo(0);
    let desc = document.getElementById('task');
    expect(index.getCurrentPomoId()).toBe(0);
    expect(desc.innerHTML).toBe("Current Task: updated test task");
    expect(index.getPomoById(0).actualPomos).toBe(1);
    expect(index.pomoData[0].sessionStatus).toBe(SESSION_STATUS.inprogress);
  });

  test("cancel pomo test", () => {
    index.createPomodoro("test task2", 2);
    index.startPomo(1);
    index.cancelPomo(1);
    expect(index.pomoData[1].actualPomos).toBe(0);
    expect(index.pomoData[1].sessionStatus).toBe(SESSION_STATUS.incomplete);
    expect(getCurrentPomoId()).toBe(-1);
  });

  test("finish task, status test", () => {
    index.createPomodoro("test task", 4);
    index.finishTask(0);
    expect(index.pomoData[0].sessionStatus).toBe(1);
  });

  test("cancel dialog popup", () => {
    index.displayCancelDialog();
    expect(document.getElementById("cancel-button-dialog").style.display).toBe("block");
    index.closeCancelDialog();
    expect(document.getElementById("cancel-button-dialog").style.display).toBe("none");
  });

  test("finish dialog popup", () => {
    index.displayFinishDialog();
    expect(document.getElementById("finish-button-dialog").style.display).toBe("block")
    index.closeFinishDialog();
    expect(document.getElementById("finish-button-dialog").style.display).toBe("none")
  })
  
  test("break dialog popup", () => {
    index.displayBreakDialog();
    expect(document.getElementById("break-button-dialog").style.display).toBe("block");
    index.closeBreakDialog();
    expect(document.getElementById("break-button-dialog").style.display).toBe("none");
  });

  test("add task", () => {
    index.setPomoData([]);
    let previous = index.visibleTasks
    document.getElementById('estimate').value = 4
    document.getElementById('task-description').value = "Test Task"
    index.addTask()
    expect(index.getPomoData()[0]["taskName"]).toBe("Test Task");
    expect(index.getPomoData()[0]["estimatedPomos"]).toBe("4");
  });

  test("remove task", () => {
    index.setPomoData([{"id":0,"taskName":"tes1","estimatedPomos":"1","actualPomos":0,"distractions":0,"sessionStatus":2},{"id":1,"taskName":"test1","estimatedPomos":"1","actualPomos":0,"distractions":0,"sessionStatus":0},{"id":2,"taskName":"test2","estimatedPomos":"1","actualPomos":0,"distractions":0,"sessionStatus":0}])
    index.removeTask(0);
    expect(index.getPomoData()[0]["sessionStatus"]).toBe(index.SESSION_STATUS.deleted);
  });
  
  test('date string format test', () => {
    var date = new Date(1613616935705)
    expect(index.getTimeString(date)).toBe("55:35");
  });
});
