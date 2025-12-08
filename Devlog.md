# Devlog Entry - 11/14

Created a repository with both a filled-out README and a devlog file. We also discussed the project in more detail, including what it should look like and how we will approach it.

# Devlog Entry 11/21/2025

11:30 AM
After scratching our heads for a bit, we found that we needed a util to get the three.js scene rendering properly.

# Devlog Entry 11/24/2025

small amount of refactoring. moved things into seperate files

# Devlog Entry 11/25/2025

More refactoring. Updating the Robot class. added camera movement. added cursor object and the start of a blend file.

# Devlog Entry 11/30/2025

started working on more work in progress blender files

# Devlog Entry 12/02/2025

Big plans for tonight! Here's a list of what we want to accomplish:

Scene:

scene object - contains array of nums making level data

function that does both of the below:

1. method that resets scene to empty void

2. function in game that builds level

when level is loaded, center camera on spawning object

Inventory:

item object - contains worldobject, modifies current item to that object

dictionary of items, item obj paired with amount

display what current item is

buttons for each item, including text for amount in inventory

Victory:

function for pausing game (true, false) - can be used for regular puase game or win condition/loss condition

pause game on win, show new div with button for next level

on click, load level

# Devlog Entry 12/04/2025

Mae
[X] Placing blocks
[X] Delete robots when colliding with the goal
[x] Make a counter for robotsSaved and robotsDestroyed for final survivial rate
[ ] Add stars to the level so that a secret level is revealed at the end (continuous inventory)

Ash
[X] Implement an inventory system that lets the player pick blocks

Nina
[x] Create a JSON file that holds all the translated text (3 languages)
[ ] Create a Play button that takes the player to the first level
[ ] Create the credits button and add them
[ ] Create a button that changes the language of the game
[ ] Make it so that when the player clicks on an interactable object, text appears

# Devlog Entry 12/05/2025

## How we satisfied the software requirements

For each of the F2 requirements, give a paragraph of explanation for how your project's implementation satisfies the requirements.
Your team can earn partial credit for covering only a subset of the F2 requirements at this stage. (It is much better to satisfy the requirements in a sloppy way right now than lock in your partial credit.)


[x] "The game uses the same 3D rendering and physics simulation identified by the team for F1 or suitable replacements that still satisfy the F1 requirements."

We didn't really have to change much here, as we've already done F1.

[x] "The game must allow the player to move between scenes (e.g. rooms)"

Our game has levels, each with a puzzle that the player must solve to traverse to the next level. Eventually, if the player beats the final levl, they reach the end screen. While we haven't finished all of the levels yet, we have a solid system for putting them together.

[x] "The game must allow the player to select specific objects in a scene for interaction (e.g. tapping an item to pick it up or examine it)"

the player can select objects in their inventory and place them on top of other objects in the real world. This interaction affects the robot agents wandering the level, which in turn affects the state of the overall world. If too many robots are killed by the player's inaction, the game resets.

[x] "The game maintains an inventory system allowing the player to carry objects so that what happens in one scene has an impact on what is possible in another scene."

There is an item class and an inventory class that holds the Item data type. The player can switch between holding nothing and holding a block, and the amount persists from level to level. There is an HTML section next to the browser that allows the player to manage these items.

[x] "The game contains at least one physics-based puzzle that is relevant to the player's progress in the game."

This was already the case in F1, but we've elaborated on the physics element.  If a robot touches a cursher, it is destroyed. Robots can now bounce on springs! All the levels are going to be physics puzzles that require that the player to protect robots wandering the level.

[x] "The player can succeed or fail at the physics-based puzzle on the basis of their skill and/or reasoning (rather than luck)."

There is at least one level that requires player intervention, or else the robots all die and the level must restart. The first level is a passive one, where no robots can be destroyed but that will change soon. 

[x] "Via play, the game can reach at least one conclusive ending."

There's an end screen! its a bit bugged right now but by tomorrow it should be exclusive to the final level. We're intending on later iterations having support for multiple languages and also being places on an empty screen as opposed to one with the level actively on it.

## Reflection

[x] "Looking back on how you achieved the F2 requirements, how has your team’s plan changed since your F1 devlog? There’s learning value in you documenting how your team’s thinking has changed over time."

Well, we definitely learned to give up on making anything with any serious amount of scope or placing too much effort into good game design. We're mainly focused on just meeting your requirements, starting with F2 and moving on to F3. 

We've been focused more on making more .js files to accomodate for all of the new classes and making things modular. This is unfortunately not as uniform as we'd like. There's still plenty of classes in game.js that probably should be pulled out at some point or another.

We're doing our best to keep things on a tight schedule, staying up late into the night to blast through this project.


# Devlog Entry 12/8/2025

[x] "save system - Support multiple save points as well as an auto-save feature so that the player cannot lose progress by accidentally closing the game app."

The game automatically saves upon the completion of each level. This includes saving information about language preferences, the player's inventory, and obviously the current level. The player can close their current tab, reload, and all of this information will be restored. We picked this because it fit our game's "level" style structure and that it would be easy to implement.

[x] "[visual themes] Support light and dark modes visual styles that respond to the user's preferences set in the host environment (e.g. operating system or browser, not in-game settings), and these visual styles are integrated deeply into the game's display (e.g. day/night lighting of the fictional rooms, not just changing the border color of the game window)"

There is support for a light mode and a dark mode. This changes the background color, as well as the color of the UI on the webpage itself. If there is no easy way to gleam a preference on which mode the user has, it automatically uses dark mode. We chose this because it is an extremely quick and easy feature to implement, and we're all fans of being able to choose between light and dark mode.

[x] "touchscreen - Support touchscreen-only gameplay (no requirement of mouse and keyboard)."

Because of the simple control scheme, this game is actually very easily made touchscreen compatible. All actions are done with taps or clicks and there is no broader input requirement than that. We initally wanted to have a pan functionality for the camera but decided it wasn't worth it because it was too finnicky for both mouse and touchscreen. We chose this feature because, as mentioned previously, this game lends itself to touchscreen gameplay with using just taps/clicks.

[x] "[i18n + l10n] Support three different natural languages including English, a language with a logographic script (e.g. 中文), and a language with a right-to-left script (e.g. العربية)."

This was surprisingly esay to implement. We created a language class with a few different attributes for each element in the UI, and then set functions that modified the UI. As mentioned before, this data is saved, so users who dont know where their language is dont have to fish through the list to find their language of choice. We opted to use google translate for our translation.

We chose this feature because it seemed like the LEAST difficult/time consuming option out of what was left, and we chose right! I mean, a third of it was done already with the game having english text, and adding two more wasn't too much of a hassle.


## Reflection

[x] "Looking back on how you achieved the F3 requirements, how has your team’s plan changed since your F2 devlog? There’s learning value in you documenting how your team’s thinking has changed over time."

Somehow, we made it. We were honestly quite surprised how quickly these last few features were able to be implemented. We were quite scared of not making the deadline throughout all of this, but with organized meetings and careful coordination through pair programming, we got it done. There's a lot of unclean code. There's unused code. There's stuff left on the cutting room floor, but it's a game that we're proud to have made from "scratch" relatively speaking. 