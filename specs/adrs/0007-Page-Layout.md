# Choose HTML Page Layout

* Status: Accepted

## Context and Problem Statement

We want to record how JS will handle the HTML pages.

## Considered Options

* single HTML page
  * JS hops between two "displayed" pages
* two HTML pages
  * just link between them

## Decision Outcome

Chosen option: Single HTML page using JS to move between them, because

* two html pages requires some url tricks which could get ugly
* not difficult to manage which page to display with JS
* first option provides simpler/less complex communication between the two pages
