#ifndef RELAY_CONTROL_H_
#define RELAY_CONTROL_H_

#include <Unit_4RELAY.h>
#include "nbiot.h"
#include "M5Atom.h"
#include "DualButton.h"
void relayControlSetup();
bool parseRelayRequest(String request, int &relayNum, int &state);
void publishRelayStates();
void relaycontrolfromString(const String& message);
void i2cScan();
void ControlRelayManualByButton();
#endif