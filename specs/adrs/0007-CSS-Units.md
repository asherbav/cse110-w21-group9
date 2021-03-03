# Choose What Type of Units to Use in CSS Code

* Status: Accepted

## Context and Problem Statement

We want to record what units we will be using for CSS.

## Considered Options

* relative units
  - em
  - rem
  - vw, vh
  - vmin, vmax
  - %
* absolute units
  - cm, mm, in
  - px
  - pt
  - pc

## Decision Outcome

Chosen option: Use px for margin and padding, because

* distractions should be logged immediately when they occur
* logging at the task page could result in forgetting what distractions occurred during work
* descriptions would make the table look too busy
* having the user provide descriptions distracts the user from focusing on their own work
