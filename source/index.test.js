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

  test("get pomo test", () => {
    expect(index.getPomo()[0].taskName).toBe("updated test task");
  });

  test("set/get current pomo test", () => {
    index.setPomo(-1);
    expect(index.getCurrentPomoId()).toBe(-1);
  });

  test("get pomo by id", () => {
    index.createPomodoro("test1", 1);
    expect(index.getPomoById(1).taskName).toBe("test1");
  });

  test("set break timer test", () => {
    index.setBreakTimer("5:00");
    expect(document.getElementById("break-timer").innerHTML).toBe("5:00");
  });

  test("set pomo timer test", () => {
    index.setPomoTimer("25:00");
    expect(document.getElementById("pomo-timer").innerHTML).toBe("25:00");
  });

  test("set current Pomo test", () => {
    index.setCurrentPomo(3);
    expect(index.currentPomoID).toBe(3);
  });

  test("get current Pomo test", () => {
    var tempID = index.getCurrentPomoId();
    expect(tempID).toBe(index.currentPomoID);
});

describe("utilities", () => {
  test("date string format test", () => {
    var date = new Date(1613616935705);
    expect(index.getTimeString(date)).toBe("55:35");
  });
});
