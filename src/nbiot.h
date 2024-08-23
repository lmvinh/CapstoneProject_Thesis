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

#ifndef INC_NBIOT_H_
#define INC_NBIOT_H_
#define TINY_GSM_MODEM_SIM7080
#include "ArduinoJson.h"
#include "M5Atom.h"
#include <PubSubClient.h>
#include "Unit_4RELAY.h"

#include <TinyGsmClient.h>
#include "M5_SIM7080G.h"
#include "Unit_4RELAY.h"
#include <time.h>
#include <sys/time.h>
#include "string.h"
#define MQTT_SERVER   "mqttserver.tk"
#define MQTT_PORT     1883
#define MQTT_USERNAME "innovation"
#define MQTT_PASSWORD "Innovation_RgPQAZoA5N"
// #define MQTT_D_TOPIC  "TestAtom"
#define MQTT_U_TOPIC_ENV "/innovation/airmonitoring/WSNs/ABC/env"  //  上传数据主题
#define MQTT_U_TOPIC_RELAY "/innovation/airmonitoring/WSNs/ABC/relay"  //  上传数据主题

#define UPLOAD_INTERVAL 10000
// uint32_t lastReconnectAttempt = 0;
#define SerialMon        Serial
#define MONITOR_BAUDRATE 115200

#define SerialAT         Serial1
#define SIM7020_BAUDRATE 115200

#define ATOM_DTU_SIM7020_RESET -1
#define ATOM_DTU_SIM7020_EN    12
#define ATOM_DTU_SIM7080_TX    22
#define ATOM_DTU_SIM7080_RX    19


// TinyGsm modem(SerialAT, ATOM_DTU_SIM7020_RESET);

// TinyGsmClient tcpClient(modem);
// PubSubClient mqttClient(MQTT_BROKER, MQTT_PORT, tcpClient);

void SetupNbiot();
void publishRelay(String payload);
void mainTainMqtt(void);
void publishEnv(String payload);
void subscribeToTopic(String topic);
#endif