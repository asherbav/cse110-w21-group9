/* 
createPomodoro, X
logDistraction, X
setName, X
setStatus, X
getPomo, X
getCurrentPomoId, 
setPomo 
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
});

describe("utilities", () => {
  test("date string format test", () => {
    var date = new Date(1613616935705);
    expect(index.getTimeString(date)).toBe("55:35");
  });
});
