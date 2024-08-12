/*
*******************************************************************************
* Copyright (c) 2022 by M5Stack
*                  Equipped with ATOM DTU NB MQTT Client sample source code
* Visit the website for more
information：https://docs.m5stack.com/en/atom/atom_dtu_nb
* describe: ATOM DTU NB MQTT Clien Example.
* Libraries:
	- [TinyGSM - modify](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/arduino/lib/TinyGSM.zip)
	- [PubSubClient](https://github.com/knolleary/pubsubclient.git)
* date：2022/4/14
*******************************************************************************
*/

#ifndef INC_DUALBUTTON_H_
#define INC_DUALBUTTON_H_
#include "M5Atom.h"

#define ButtonAPin        23
#define ButtonBPin        33
void setUpDualButton();
bool buttonAisPress();
bool buttonBisPress();
#endif