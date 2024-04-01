// main.h
#ifndef MAIN_H_
#define MAIN_H_

#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFiManager.h>
#include <PMS.h>
#include <DHT.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <LiquidCrystal_I2C.h>

// คอนฟิกกุเล๊ะชั่นน
#define PUBLISH_INTERVAL 2000
#define READ_INTERVAL 2000
#define DHTPIN 23
#define TRIGGER_PIN 0
#define DHTTYPE DHT11
#define LCD_I2C_ADDRESS 0x27

// ส่วนนี้เรียกไรไม่รู้ แต่อย่าไปแตะมัน
unsigned long time_1 = 0;
unsigned long time_2 = 0;

 // Replace with your PM2.5 value
// WiFi Credentials
const char *ssid = "Ass Hole Purifier";
const char *password = "1212312121";

// อันนี้ควรเรียกไงวะ Prototype หรอ เออช่างแม่ง อย่าไปแตะมันนะ :<
String prevPM25, prevPM10, prevTemp, prevHum;
bool wifiConnectionResponse;
bool enabledAutomatic;

// HTTP Server Settings
const char *http_server_url = "http://192.168.1.38:3002";

// MQTT Broker Settings
const char *mqtt_broker = "192.168.1.38";
const char *mqtt_username = "purifier";
const char *mqtt_password = "tas5630a";
const int mqtt_port = 1883;
const char *mqtt_data_topic = "data";
const char *mqtt_state_topic = "state";

WiFiClient espClient;
PubSubClient mqtt_client(espClient);
PMS pms(Serial2);
PMS::DATA data;
HTTPClient http;
DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(LCD_I2C_ADDRESS,16,2);
WiFiManager wm;

// Function Declarations
void connectToWiFi();

void connectToMQTT();

void mqttCallback(char *mqtt_topic, byte *payload, unsigned int length);

void on();

void off();

void automatic();

void automaticLoop();

void checkButton();

#endif // MAIN_H_