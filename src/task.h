#ifndef TASK_H_
#define TASK_H_
#include <Arduino.h>
#include "M5UnitENV.h"
#include "M5Atom.h"
#include "string.h"
#include "Unit_4RELAY.h"
#include "ArduinoJson.h"
#include "nbiot.h"
#include "index.h"
#include <WiFiType.h>
#include "WiFi.h"
#include "relay_control.h"
#define LED_ERROR   0x110000
#define LED_OK      0x001100
#define LED_NETWORK 0x000011
#define LED_MEASURE 0x111111

void envMeasureTask(void*);
void pubsubTask(void*);


#endif