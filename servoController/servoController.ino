/*
 Controlling a servo position using a potentiometer (variable resistor)
 by Michal Rinott <http://people.interaction-ivrea.it/m.rinott>

 modified on 8 Nov 2013
 by Scott Fitzgerald
 http://www.arduino.cc/en/Tutorial/Knob
*/

// make sure to include the Servo library in Arduino IDE
#include <Servo.h>

Servo myservo;  // create servo object to control a servo

int val;    // variable to read the value from the analog pin

void setup() {
  myservo.attach(9);  // attaches the servo on pin 9 to the servo object
}

void loop() {
  // read the character we recieve on the serial port from the RPi
  if(Serial.available()) {
    val = Serial.read();
  }
  myservo.write(val);                  // sets the servo position according to the scaled value                          // waits for the servo to get there
}
