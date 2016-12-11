# mars
## open source Audience Response System

### Introduction

MARS is a browser-based Audience Response System dedicated to e.g. teachers, moderators to support their courses to evaluate knowledge, assess opinions or illustrate concepts, or just for fun!

MARS is published under the GNU GPLv3 open source licence and is free. Polls remain completely under your control and can be shared if, and only if, you choose to do so.

MARS puts the control on the poll material back into your own hands, as opposed to many online commercial products that take away from you the ownership as well as the control over your intellectual property, in order to make profits.
Vocabulary

MARS uses following concepts:

* the poll

The poll is a set of questions. A poll can be created and edited in the system and can furthermore be exported/imported 
(easy JSON files) and shared e.g. via simple email.
* poll types

Polls have a type that is determined at creation time depending on the intention of the poll author. Two types are defined:

* the quiz type
The quiz type of poll is preferred for evaluation purposes. Results will display falsy/truthy answers and scores that can be directly used for rating purposes.
* the poll type
The poll type of poll (sorry for redundancy) is preferred for opinion assessment or situations where evaluation and scores are not relevant. Results will just display choices without scoring.

* the session
The session is the live execution of a poll. Sessions consist of question display and score/result evaluation. 
Sessions are stored and can be retrieved and displayed later for testimony purposes. 
Moreover, sessions can be re-played, providing cumulative result recording among multiple student groups.
* the session play modes

Sessions can have one of two play modes determined at session start time :
* the normal mode where students will see all questions simultaneously on their client application, thus focusing attention on their terminals. The teacher screen will meanwhile display results, scores and answers in real time. Session duration is under teacher's manual control.
* the group mode where the teacher screen will display the questions one at a time, so that student attention will be focused collectively on the teacher screen. Their client application will only display choice means for one question at a time. Realtime aspects are in the foreground and question display duration as well as session duration are automated and determined by the poll author during question editing. Results and scores will be displayed at the end of the session.

* roles and software applications

  * the teacher role relies on the usage of the MARS manager application (yes correct, actually this page is part of it).
  * the student role is supported by the MARS client application . The URL of this application is displayed at 
session start time for all to see.

