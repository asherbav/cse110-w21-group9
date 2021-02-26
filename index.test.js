// createPomodoro, logDistraction, setName, setStatus, getPomo, getPomoById, getCurrentPomoId, setPomo

jest.useFakeTimers();

describe("data storage tests", () => {
  test("create pomodoro test", () => {
    index.createPomodoro("test task", 4);
    expect(JSON.stringify(pomoData[i])).toBe(
      JSON.stringify({
        id: 0,
        taskName: "test task",
        estimatedPomos: 4,
        actualPomos: 0,
        distractions: 0,
        sessionStatus: SESSION_STATUS.incomplete,
      })
    );
  });

  test("log distraction test", () => {
    index.logDistraction(0);
    expect(pomoData[0].distractions).toBe(1);
  });
});

describe("utilities", () => {
  test("date string format test", () => {
    var date = new Date(1613616935705);
    expect(index.getTimeString(date)).toBe("55:35");
  });
});
