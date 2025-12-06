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
