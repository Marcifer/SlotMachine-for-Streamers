# Fully Customizable Slot Machine


## A fully customizable Slot Machine, which can be controlled with Streamer.bot

Original Pen created on CodePen.io. Original URL: (https://codepen.io/rattatat/pen/mXqJEq).
Pen tweaked and modified by ***MarkusoOoO*** (https://www.twitch.tv/markusoooo) to work with Streamer.bot (https://streamer.bot/).

This project uses VueJS to create interactable Slot Machine which can be controled using websocket server that communicates with Streamer.bot (*I will use shortcut SB from now on in this document*), to enhance control of the Slot Machine.
You can control Slot Machine using commands written into the chat of your stream.

Commands should use custom points system as a way to generate and manipulate points for Slot Machine. Here are two examples, that can be used:
  - **VRFlad's points system - TESTED** > https://www.youtube.com/watch?v=VCnoT7wqNrE
  - *TerrierDart's points system - NEEDS TESTING, may not work in current version* > https://terrierdarts.pages.dev/en/ranking_system/core/




## Example video

[![EXAMPLE VIDEO OF SLOT MACHINE](https://i.ytimg.com/vi_webp/vyXUFI1ySIw/maxresdefault.webp)](https://www.youtube.com/watch?v=vyXUFI1ySIw "Slot Machine Demo")

Overlay on top of the browser source seen in this example was drawn by my lovely wife <3 ***FoxyThePurpleWitch*** <3 (https://www.twitch.tv/foxythepurplewitch).

Chat widget seen in the demo video was made by ***Blackywersonst*** (https://www.twitch.tv/blackywersonst).




# Guide to make this work for you

Video instructions coming soon (I say that a lot). Here is a text version in the "meantime".



## Prerequisites

-  OBS v29.1.3+ (https://obsproject.com/)
-  Streamer.bot (SB) v0.1.22+ (https://streamer.bot/)
-  Zip file provided in this repo
-  (Points system) is **NOT REQUIRED** but **HIGHLY recommended** (see top of this guide for my choices, or you can code your own Points system.. this project **WILL WORK** even without any Points system)
-  Determination and plushie to squeeze on successful implementation f.e. (https://www.kidrobot.com/products/marvel-deadpool-riding-unicorn-plush?variant=32772198269025)




## Text Guide

1. This guide assumes, that OBS and SB are installed, SB is connected to Twitch and/or Youtube and to the OBS itself (you can find a tutorial on how to do this on Youtube, here is one example by Nutty > https://www.youtube.com/watch?v=CcXAs-qZ0Ys).

2. Unzip the zip file provided in this repo. In the zip folder, there will two text files (license and SB import), this readme and folder called `SlotMachine`. 
   Place folder `SlotMachine` somewhere on your disk, we will need to reference it later. For example, I will put it into the path `D:\StreamingStuff\SlotMachine`.

3. Open OBS and create new `Scene` (**take note of the EXACT name of this scene**) and in this scene, `Add` > `Browser` (**also take note of EXACT name of this source**). Lets go over the fields in `Browser` source:
   - `URL` needs to contain URL of your `index.html` which can be found in our example path at `D:\StreamingStuff\SlotMachine\index.html`. Easiest way how to reference this file, is to open it in any browser (or just double click) and then paste the address into this field.
     For this example, it would be `file:///D:/StreamingStuff/SlotMachine/index.html`. I do not recommend checking `Local file` and selecting it that way.
   - `Width` I would recommend at `520`, but you can play with it.
   - `Height` I would recommend at `820`, but again, you can play with it.
   - Check `Shutdown source when not visible` & `Refresh browser when scene becomes active`.
   Click `Ok` and try hiding and showing the newly created source (you should see SlotMachine showing and hiding). If you do not see anything, you probably have wrong `URL`.
   OBS part is now done! Pat yourself on head and smile! :3

4. Let's setup SB now. 

   - **Streamer.bot actions/commands import**

     As mentioned in step 2, there is an import file called `StreamerBotImportSlotMachine.txt`, that you got from the zip folder you downloaded.
     In SB click on Import (on top bar of the window). New window called `Import Actions` should appear. 
     Drag and drop `StreamerBotImportSlotMachine.txt` into `Import String` field. You should see 8/8 actions and 6/6 commands being selected.
     Click `Import` and on popup window click `OK` (we are gonna address that popup window now). In SB click on tab `Commands`, find group called `SlotMachine`, right click that group (with blue   color) select `Group` > `Enable All` (or enable all commands one by one, if you struggle to find the option described).
   
   - **Slot Machine websockets settings**

     Now we need to make sure, that SB can communicate with Slot Machine. Select tab `Servers/Clients` > `Websocket Server` (Server, not Servers!).
     Check `Auto Start` (to make sure, we do not need to start the server every time we restart SB). And click on `Start Server`.
     Take note of the `Address`, `Port` and `Endpoint`. These must match with variables in `script.js` located in our example path at `D:\StreamingStuff\SlotMachine\script.js` first three   uncommented lines (uncommented line = no `//` at start of the lines).
     In SB default values are: IP - `127.0.0.1`, Port - `8080`, Endpoint - `/`, so these should match with values in `script.js`. If they do not match or you use different values, change them   accordingly on both places.
     *Okay, we enabled commands and made sure SB communicates with our Slot Machine. Now let's make sure, all imported actions are setup correctly and working.*
   
   - **Streamer.bot Variables**
   
     In SB select `Actions` and select `SlotMachine redeem` (this is Action that starts it all, binded to command !slots).
     `Sub-Actions` (right side of window) have few places that should be checked. On top there is folder called `Variables - CHECK ME!`. Click the small `+` button.
     You can find comments for each set of variables in SB itself, but lets glance over them also in this guide (double click each sub-action if you wish to change it).
      - `connection` indicates which OBS instance we wish to use. If you use only one OBS instance, leave it at default value of `0`. If you use multiple instances of OBS (for multi PC stream   setup f.e.) look into `Stream Apps` tab and choose OBS instance (I know there are other apps then OBS, but I have chosen to ignore them LUL) you wish to connect to (number is all the way to the   left).
      - `slotsBetMin` & `slotsBetMax` indicate how much points is required in minimum to allow the game to start and how much is the maximum points. For both of them, please use multiples of 10   (**so our smallest possible ammount will be always 10!**). In short, do not use values that do not end with `0`.
      - `slotsStartActionName` is selfexplanatory from its name. It is name of Action in SB that is in imported group `SlotMachine by MarkusoOoO`. Very important, keep it at default if you do not   plan on renaming any Actions.
      - `slotsSceneName` & `slotsSceneSource` must match exactly Scene name and Source name in OBS (we already set this up in third point of this guide).

   - **Streamer.bot C# compile check**
   There is three C# in actions, which needs to be checked:  
       
      - In SB select `Actions` and select `SlotMachine redeem`. Double click `Sub-Action` called `Execute Code (SlotMachine Redeem Crossroads)` and hit `Compile`. You should see in `Compiling Log` this message: `Building out needed information... Compiled successfully!` (if you see something else, you are probably missing some references, so click on `Find Refs` and then `Compile`). Click `Save   and Compile`.
      
      - In SB `Actions` tab, select `SlotMachine Cashout`. Then double click on `Sub-Action` called `Execute Code (Slot Cashout Crossroad)` and click on `Compile`. You should see in `Compiling Log` this message - `Building out needed information... Compiled successfully!` (if you see something else, you are probably missing some references, so click on `Find Refs` and then `Compile`). Click `Save and Compile`.
      
      - For the last time, in SB `Actions` tab, select `SlotMachine Lock`.
      Then double click on `Sub-Action` called `Execute Code (Check Reels Lock Argument Crossroad)` and click on `Compile`.
      You should see in `Compiling Log` this message - `Building out needed information... Compiled successfully!` (if so, ignore three next lines in this guide and click `Save and Compile`.).
      **If you see some dependency errors, here is a fix!**. In `Execute C# Code` window, next to `Compiling Log`, click on `References`.
      You have to manually add `System.Linq.dll` & `System.Core.dll`. How? Right click the white space in `References` tab and click on `Add reference from file...`. Into `File name` fill in `System.Linq.dll` and click `Open`. And do same for `System.Core.dll`.
      Try clicking `Compile` now and you should see in `Compiling Log` this message - `Building out needed information... Compiled successfully!`. Click `Save and Compile`.

   - **Do this only if you rename any of the actions**

      In SB `Actions` tab, select `SlotMachine Start`. Once again, on top, there is folder called `Variables - CHECK ONLY IF RENAMING`.
      This folder contains names of all `Actions` from group `SlotMachine by MarkusoOoO`. There is no need to change anything, unless you are renaming them in SB.

**And you are done seting everything up!**



## Testing and explanation of commands
   
It is time for *testing*, so let's go over the commands and how they work (**make sure, your SlotMachine source is hidden before testing!**). 
Once Slot Machine game starts with fsrst command !slotStart, any other command will work ONLY for user who started the game (exception is last command listed here, !slotsForceEnd). 

Try typing following commands into twitch/youtube chat for testing:

-  !slotStart *points ammount* sets all pieces in action, if all checks are passed (minimum, maximum point ammounts, C# compiles, OBS source and scene names are correct, all arguments are happy, Lucifer smiles, etc..) it shows OBS source with Player Name (whoever started the game) and Credits with same ammount that are after the command !slots. Name of the points is by default called `points`, unless you changed it using your Points System of choice (or use Testing argument, described below).

   *example:* `!slotStart 200` initiated by me, would fill under Player: MarkusoOoO and under Credits: `200 points` (since I did not change default points to something else in my example).
   **Side note: amount of point your are betting must be multiples of 10, eg. 10, 20, 30... 300, 310, 320... 1110, 1120... Reason being, actual spin cost is always devided by 10. If you try to use something like "!slotStart 111" it will not let you through and you will get a response in the chat.

-  !slotSpin would start the Slot Machine and spin the reels. Cost of each spin is ALWAYS ammount bet at start devided by 10.

   *example:* `!slotSpin`

-  !slotLock *reel options* will lock selected reels. This Slot Machine has 3 reels to choose from. 
   There are two rules for locking reels. You can lock only once in a row. If you receive one or more jackpot items on spin, lock is disabled that turn.

   *examples:* `!slotLock 23`: locks second and third reel, `!slotLock 3`: locks third reel, `!slotLock 123`: locks all three reels (if you do this, and then you !slotSpin, you just spent credits for nothing KEKW)

-  !slotTransfer will move your Won points into your Credits (so you can continue spining).

   *example:* before I use the command, I see that under Credits is 0 and under Won is 690. Using `!slotTransfer` shift Won to 0 and Credits to 690, so I can continue spining using Credits.

-  !slotWithdraw ends the game, hiding the source in OBS and summing up the game by adding together Credits and Won and adding them to the points of the player. All information is shown in twitch chat.

   *example:* before I use the command, I see that under Credits, I have 420 and under Won is 690. Using `!slotWithdraw` I see in chat, that game ended and I got 1110 points added to my current points.

-  !slotForceEnd is only command, that can be used by anyone, so I highly recommend setting it as MODS ONLY in SB.

   *example:* `!slotForceEnd` - same thing happens as with !slotWithdraw

**Side note: Once somebody starts the game with !slotStart command, only that user can use commands tied with the game, nobody else! Not even you as a streamer. However, there is one safeguard command, !slotsForceEnd, that will end the game immediately and it does not matter who writes it (I suggest making this MOD only command). There is three situations Slot Machine game ends: 1. Player reaches 0 at Credits and also has 0 at Won (game ends automatically, telling player he lost everything in chat). | 2. Player decides to use !slotWithdraw. | 3. Someone writes !slotsForceEnd (same as !slotWithdraw, but anyone can use it)**


### And here we are! Did all of the commands work as expected? Well, you just finished the setup! Well done! Get some ice cream, squeeze your plushie! **YOU** did it!



## What can go wrong?

Here is list of possible issues that you could encounter:
-  !slots command outputs that I have only 0 points. Well, you either should get some points first, or, you are not using any Points System. Please refer to top of this guide, where you can choose either VRFlad's Point System or TD's point system.

   However, if you just want to make sure everything works and test the Slot Machine, you can, as a temporary workaround, set fix value of points to whoever calls the `!slotStart` command and triggers `SlotsMachine Redeem` action.

   I prepared required `Sub-Action` for this in `Action` called `SlotMachine redeem` in group called `Static points value and name group for testing without Points System`. Select `Sub-Action` inside this group, called `Set user specific (redeemer)`, right click it > `Enabled`. You can also double click it and change `Value` of 666 I put in there.

   Now you can test !slots and other commands. But you will always set user to have always the same ammount of points we just defined and it resets on each start of new game. So please, either use one of already made Points Systems or code your own.
   
   **Remember to disable that Set user specific subaction when you do not need it anymore for testing and have Points System in place!**

-  !slots command does not output anything into the chat. Well, you probably forgot to enable the command descibed in step 4 of text guide, or something is crashing. Look into your log in SB and try to point out the issue or send it either to SB discord or try contacting me via DM with your log.

-  Something else is not working? Refer to Find a bug? part bellow or if very desperate, my DMs on discord are always open.




# Can I tweak visuals/function to my own needs?

Yes! This project is fully customizable! 

Since this project is mainly made with VueJS, you can basically modify any behaviour and/or add more features straight in `script.js`. It uses VueJS v2.

Other resource changes, eg. images of items on Slot Machine or sounds effects, can be easily swapped with provided example files (just keep the naming of the files same) in the paths for my example: `D:\StreamingStuff\SlotMachine\images\` & `D:\StreamingStuff\SlotMachine\sounds\`. Images work best when they have "squared" resolution.

If you want to change colors, positioning, fonts, font size, etc... use `style.css`. Pro TIP, you can use show and hide source transition, to make browser source appearing and disappearing look way smoother. Also, you can add overlay on top of browser source, which can look like actual Slot Machine!

You want to change currency name? Use **Points System** for that. Or you can **just for testing** use pre-made `Sub-Action` in `Action` called `SlotMachine redeem` in group called `Static points value and name group for testing without Points System`. 
Select `Sub-Action` inside this group, called `Set argument %pointsname%`, right click it > `Enabled`. You can also double click it and change `Value` of "chimi" I put in there.

**Remember to disable that Set argument subaction when you do not need it anymore for testing and have Points System in place!**




# Found a bug?

If you found an issue or would like to submit an improvement to this project, please do so using the issue tab above. If you would like to submit a PR with a fix, reference the issue itself in it!




# Known issues (Work in progress)

This project is by no means complete. It needs to be properly tested by other users than myself, to make sure everything is working as expected.

TD's Points system might not work (I did not test it yet). I will implement it eventually (wink).

Youtube chat commands were not tested. They should work without any issues (in theory). I will be glad for feedback on that.

Video guide will be provided (soon, cough cough).




# Do you like what I do?

No, I am not gonna sell-out. But I appreciate all the support of what I do at my twitch channel > https://www.twitch.tv/markusoooo (interactive stream with demon lord himself.. every viewer, that actually interacts on stream, is very welcome).