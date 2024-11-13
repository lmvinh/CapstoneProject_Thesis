#include "DualButton.h"
#include "M5Atom.h"
int last_value1 = 0, last_value2 = 0;
int cur_value1 = 0, cur_value2 = 0;
void setUpDualButton()
{
	pinMode(ButtonAPin, INPUT);  // set pin mode to input.设置引脚模式为输入模式
	pinMode(ButtonBPin, INPUT);
}

bool buttonAisPress() {
  cur_value1 = digitalRead(ButtonAPin);  // Read the current state of Button A

  if (cur_value1 == 1 && last_value1 == 0) {  // Check if Button A is pressed
	last_value1 = cur_value1;
	M5.dis.fillpix(0x001100); 

	return true;  // Return true if Button A was just pressed
  }

  last_value1 = cur_value1;
  return false;  // Return false if Button A was not just pressed
}

bool buttonBisPress() {
  cur_value2 = digitalRead(ButtonBPin);  // Read the current state of Button B

  if (cur_value2 == 1 && last_value2 == 0) {  // Check if Button B is pressed
	last_value2 = cur_value2;
		M5.dis.fillpix(0x001100); 

	return true;  // Return true if Button B was just pressed
  }

  last_value2 = cur_value2;
  return false;  // Return false if Button B was not just pressed
}