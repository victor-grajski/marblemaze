# Setup Instructions
![swervo parts](https://live.staticflickr.com/65535/51343954456_baf096c760_b.jpg)
A: keyboard/trackpad
B: monitor
C: Raspberry Pi (RPi)
D: monitor power cable
E: RPi power supply
F: RPi HDMI cable
G: Arduino micro-USB-to-USB cable
H: servo motor driver
I: breadboard
J: servo battery pack
K: mobile game board enclosure
L: computing garage + game board
M: GoalZero battery

## 1. Connect servo motors to extension cables

Slot 1 on the servo driver corresponds to x-axis (left-right) motor, Slot 2 corresponds to the y-axis (forward-back) motor

Connect the wires such that the black wire from the servo driver connects to the brown wire from the motor

![driver motor connection](https://live.staticflickr.com/65535/51344560139_6dd17c8d1e_b.jpg)

## 2. Power battery pack on

## 3. Connect breadboard to Raspberry Pi

Using the short micro-USB to USB cable, plug the micro-USB into the breadboard, and plug the USB into a USB slot in the Raspberry Pi

## 4. Connect HDMI

Using the mini-HDMI-to-HDMI cable, connect the mini-HDMI into the Raspberry Pi's left mini-HDMI slot

## 5. Connect Raspberry Pi power

Using the Raspberry Pi power supply, plug the USB-C end into the Raspberry Pi using the plug next to the mini-HDMI

When connected, the Raspberry Pi plugs should look like the image below:

![rpi plugs](https://live.staticflickr.com/65535/51344964435_d4401a0822_b.jpg)

## 6. Place hardware in the "garage" at the front of the computing enclosure

Make sure not to place any heavy items on top of the breadboard or the servo driver

![enclosure garage](https://live.staticflickr.com/65535/51343940576_f550858970_b.jpg)

## 7. Arrange wires above the garage lip so they move freely along the side gaps

![garage wires left](https://live.staticflickr.com/65535/51344170963_33c184274a_b.jpg)

![garage wires right](https://live.staticflickr.com/65535/51344689409_6a70dfc377_b.jpg)

## 8. Dock computing enclosure onto main housing

Either orientation is fine

Be sure to double check the wires can move freely up and down the gap

## 9. Turn on the Goal Zero AC plug and plug the Raspberry Pi power adapter into it

## 10. Turn on the Goal Zero USB plug and plug the monitor USB power cable into it

The Goal Zero should look like the image below:

![goal zero](https://live.staticflickr.com/65535/51343227947_7cd820dea5_b.jpg)

## 11. Plug the HDMI cable into the monitor

## 12. Plug the USB power into the monitor 5V IN port

The monitor should automatically power on

## 13. Flip the Raspberry Pi power supply on

The RPi will need a few moments to boot up

## 14. Turn the keyboard/trackpad power on

## 15. Turn your phone's mobile hotspot on and connect the RPi to it

## 16. On the RPi, open a terminal window and start the ngrok server

`ngrok http 3000`

This will expose the local server (once it's running) to the web so the phone controllers can access it

Note: you'll need to [sign up for your own account](https://dashboard.ngrok.com/signup) and provide your own [auth token](https://ngrok.com/docs#getting-started-authtoken)

## 17. On the RPi, open a new terminal tab and navigate to the repo

`cd /home/pi/marblemaze`

If prompted for a password, enter 'raspberry' (I can't spell raspberry correctly)

## 18. Start the webserver

There are a number of ways to customize the gameplay. You can start the game with 1 or 2 players, and you can calibrate the y-axis set point to each player's phone. Thus the usage is as follows:

`node server.js /dev/ttyUSB0 NUM_PLAYERS PLAYER_ONE PLAYER_TWO`

`server.js` is the name of the webserver file

`/dev/ttyUSB0` is the name of the serial port the game uses

NUM_PLAYERS must be an int (either 1 or 2)

PLAYER_ONE and PLAYER_TWO must be floats between `-10.0` and `10.0`. You can set these to the resting points of each phone on its seat to calibrate the y-axis. More on this below.

PLAYER_ONE corresponds to the left front-facing seat and PLAYER_TWO corresponds to the right front-facing seat. The order matters!

For example, if playing with one player, enter the following: 

`node server.js /dev/ttyUSB0 1 0.0 0.0`

If playing with two players, enter the following:

`node server.js /dev/ttyUSB0 2 0.0 0.0`

## 19. Connect phones to exposed local webserver

Once ngrok and the local webserver are running, navigate the 1 or 2 phones you will be playing with to the URL ngrok generates

Note: the phones must be iOS for the purposes of this prototype in order to access the accelerometer data

Note: you must connect to the https URL in order to be able to access the accelerometer data!

Note: make sure to set the display auto-lock to Never so the display won't turn off during the game and stop sending its accelerometer data

Note: lock the portrait orientation on the display to keep the x and y values consistent

## 20. On each phone, join the game

Click the join button, and you will be prompted to allow access to Motion and Orientation

## 21. On each phone, note the resting y-axis value

## 22. Calibrate webserver for phones

Kill the webserver with ctrl+c and re-enter the resting y-axis values coming from the webpage on each phone in the startup command

For example, if the resting value for PLAYER_ONE is -3.5 and -3.0 for PLAYER_TWO, restart the server with the following command:

`node server.js /dev/ttyUSB0 2 -3.5 -3.0`

## 23. Refresh and re-join the game on each phone

## 24. Tuck each phone into its pillow

## 25. Play!

Once all players' phones have joined you'll see a prompt on the command line `Ready to start? (y/n)`. Type `y` and hit Enter to start moving the game board with your phones!

To reset the game with new y-axis calibration points, repeat steps 21-25

You can place the whole enclosure + GoalZero in a car and unplug the monitor once everything is calibrated and running!
