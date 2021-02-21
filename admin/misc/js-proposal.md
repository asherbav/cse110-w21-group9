# Pomodoro App JS Proposal

This is a rough draft, just my thoughts on how we should structure our JS work.

## Files
- main.js
We really only need one JS file

## Two Page Handling
We need to decide how to manage the two pages:
1. Single HTML page, use JS to hop between the two "displayed" pages
    - Pros: Simpler communication between the two pages
    - Cons: We have to manage which page we display, but this isn't that hard
2. Two HTML pages, just link between them
    - Pros: Simpler page management, and since we are already using localstorage it's easy if we want to add persistance
    - Cons: Have to use localstorage/cookies (not too hard) or some url tricks (ugly) to talk between pages
Overall thouhgts: It doesn't really matter which we choose, and in my experience neither method is particularly complicated, we just need to decide on one or the other.

## Rought API
These could be objects, or just functions, but I think our code should be broken down somewhat like this
- Pomodoro Management - Responsible for creating, and updating our recorded pomodoros. This should be the only part of the API that actually talks to whatever storage solution we run with (variable or localStorage or cookies)
  - createPomodoro(string taskName, string description, int estimatedPomos) - returns pomoId
  - logDistraction(int pomoId)
  - logPomo(int pomoId)
  - setDescription(int pomoId, string description)
  - setName(int pomoId, string pomoname)
  - setStatus(int pomoId, int? pomoStatus)
  - getPomo() - Returns json array of all the pomodoros
  - getPomo(int pomoId) - return json object of a single pomo, or null if that pomo doesn't exist
- Interaction
  - setCurrentPomo(int pomoId) - Sets a pomodoro id variable so everyone can get it
  - getCurrentPomo() - returns pomodoro id variable
  - startPomo(int pomoId) - called when user presses start pomo, loads that pomo and goes to the timer page
  - finishPomo() - called when the pomo timer ends, calls startBreaktimer and takes us to the break screen
  - finishSession() - called when the user presses finish session on the table
  - cancelPomo() - called when cancel button is pressed, stops the pomo, takes us to the table
  - updatePomo() - called whenever the user updates something about the pomodoro (status, changes description, etc) and handles it appropriately.
  - addTask() - called when user presses add task button
  - finishBreak() - called when break timer finishes, opens the break ended popup
  - confirmFinishBreak() - called when the user confirms the break is finished
  - startPomotimer() - Called to start the pomo timer. Responsible for updating the timer display, and calling finishPomo()
  - startBreaktimer() - Called to start the appropriate break timer. Determines type of break, updates timer display and calls finishBreak()
  - updateTable() - Called whenever we need to update the table. Gets data from the pomodoro management functions and updates the table accordingly.
  - logDistraction() - Called when log distraction button is pressed. Calls logDistraction(int) with the correct pomoid
