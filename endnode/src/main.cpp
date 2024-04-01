#include "main.h"

void setup()
{
    pinMode(2, 0x03);
    pinMode(TRIGGER_PIN, 0x01);
    dht.begin();
    lcd.init();
    lcd.backlight();
    lcd.clear();
    Serial2.begin(9600);
    Serial.begin(115200);
    lcd.setCursor(0, 0);
    lcd.print("ASS HOLE!!");
    delay(3000);
    connectToWiFi();
    http.begin(http_server_url);
    int httpCode = http.GET();
    if (httpCode == 200)
    {
        String content = http.getString();
        if (content.equals("on"))
        {
            on();
        }
        else if (content.equals("off"))
        {
            off();
        }
        else if (content.equals("auto"))
        {
            automatic();
        }
        Serial.println(content);
        Serial.println("-----------------");
    }
    else
    {
        Serial.println("Fail. error code " + String(httpCode));
    }
    mqtt_client.setServer(mqtt_broker, mqtt_port);
    mqtt_client.setKeepAlive(60);
    mqtt_client.setCallback(mqttCallback); // Corrected callback function name
    connectToMQTT();
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("OKAY READY!!");
    lcd.setCursor(0, 1);
    lcd.print(":)");
    delay(3000);
    lcd.clear();
}

void connectToWiFi()
{
    wm.setConnectTimeout(180);
    wm.setConnectRetries(100);
    if (wm.getWiFiIsSaved())
    {
        lcd.setCursor(0, 1);
        lcd.print("Connecting...");
    }
    else
    {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Please setup");
        lcd.setCursor(0, 1);
        lcd.print("network ;-;");
    }
    wifiConnectionResponse = wm.autoConnect(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    if (!wifiConnectionResponse)
    {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Ohh My heart is");
        lcd.print("broken :(");
        delay(3000);
        ESP.restart();
    }
    Serial.println("\nConnected to WiFi");
}

void connectToMQTT()
{
    while (!mqtt_client.connected())
    {
        String client_id = "esp32-client-" + String(WiFi.macAddress());
        Serial.printf("Connecting to MQTT Broker as %s.....\n", client_id.c_str());
        if (mqtt_client.connect(client_id.c_str(), mqtt_username, mqtt_password))
        {
            Serial.println("Connected to MQTT broker");
            mqtt_client.subscribe(mqtt_data_topic);
            mqtt_client.subscribe(mqtt_state_topic);
        }
        else
        {
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Failed... :(");
            lcd.setCursor(0, 1);
            lcd.print("Trying again.");
            Serial.print("Failed, rc=");
            Serial.print(mqtt_client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void mqttCallback(char *mqtt_topic, byte *payload, unsigned int length)
{
    if (strcmp(mqtt_topic, mqtt_state_topic) == 0)
    {
        // ประกาศตัวแปร String
        String message;

        // วนซ้ำ payload และแปลง byte เป็น char
        for (unsigned int i = 0; i < length; i++)
        {
            message += (char)payload[i];
        }

        // พิมพ์ข้อความ
        Serial.print(message);
        Serial.println("\n-----------------------");

        if (message.equals("on"))
        {
            on();
        }
        else if (message.equals("off"))
        {
            off();
        }
        else if (message.equals("auto"))
        {
            automatic();
        }
    }
}

void loop()
{
    checkButton();
    if (!mqtt_client.connected())
    {
        connectToMQTT();
    }
    if (pms.read(data))
    {
        if (prevPM25 != String(data.PM_AE_UG_2_5) || prevPM10 != String(data.PM_AE_UG_10_0) || prevTemp != String(dht.readTemperature()) || prevHum != String(dht.readHumidity()))
        {
            automaticLoop();
            JsonDocument doc;
            // เตรียมข้อมูล JSON
            doc["pm1"] = data.PM_AE_UG_1_0;
            doc["pm2_5"] = data.PM_AE_UG_2_5;
            doc["pm10"] = data.PM_AE_UG_10_0;
            doc["temperature"] = dht.readTemperature();
            doc["humidity"] = dht.readHumidity();

            // ประเมินขนาด buffer ที่ต้องใช้เพื่อเก็บ JSON String **กู ขก. ระบุเองไงงงง :(**
            char jsonBuffer[measureJson(doc) + 1];

            // แปลง JSON เป็น String
            serializeJson(doc, jsonBuffer, sizeof(jsonBuffer));
            mqtt_client.publish(mqtt_data_topic, jsonBuffer);

            Serial.print(F("PM 1.0 (ug/m3): "));
            Serial.println(data.PM_AE_UG_1_0);

            Serial.print(F("PM 2.5 (ug/m3): "));
            Serial.println(data.PM_AE_UG_2_5);

            Serial.print(F("PM 10.0 (ug/m3): "));
            Serial.println(data.PM_AE_UG_10_0);

            Serial.print(F("Temperature: "));
            Serial.print(dht.readTemperature());
            Serial.println(F("°C"));

            Serial.print(F("Humidity: "));
            Serial.print(dht.readHumidity());
            Serial.println(F("%"));

            Serial.println();

            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("PM2.5: ");
            lcd.print(data.PM_AE_UG_2_5);
            lcd.setCursor(0, 1);
            lcd.print("PM10:  ");
            lcd.print(data.PM_AE_UG_10_0);

            lcd.setCursor(9, 0);
            lcd.print("T:");
            lcd.print(dht.readTemperature());
            lcd.print("C");
            lcd.setCursor(9, 1);
            lcd.print("H:");
            lcd.print(dht.readHumidity());
            lcd.print("%");

            // เก็บค่าปัจจุบันเพื่อเปรียบเทียบใน loop ถัดไป
            prevPM25 = String(data.PM_AE_UG_2_5);
            prevPM10 = String(data.PM_AE_UG_10_0);
            prevTemp = String(dht.readTemperature());
            prevHum = String(dht.readHumidity());
        }
    }
    mqtt_client.loop();
}

void on()
{
    enabledAutomatic = false;
    digitalWrite(2, 0x1);
}

void off()
{
    enabledAutomatic = false;
    digitalWrite(2, 0x0);
}

void automatic()
{
    enabledAutomatic = true;
}

void automaticLoop()
{
    if (enabledAutomatic)
    {
        if (data.PM_AE_UG_10_0 >= 50 || data.PM_AE_UG_2_5 >= 50)
        {
            on();
        }
        else
        {
            off();
        }
    }
}

void checkButton()
{
    // check for button press
    if (digitalRead(TRIGGER_PIN) == LOW)
    {
        // poor mans debounce/press-hold, code not ideal for production
        delay(50);
        if (digitalRead(TRIGGER_PIN) == LOW)
        {
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("................");
            lcd.setCursor(0, 1);
            lcd.print("................");
            Serial.println("Button Pressed");
            // still holding button for 3000 ms, reset settings, code not ideaa for production
            delay(3000); // reset delay hold
            if (digitalRead(TRIGGER_PIN) == LOW)
            {
                lcd.clear();
                lcd.setCursor(0, 0);
                lcd.print("Erasing Config");
                Serial.println("Button Held");
                Serial.println("Erasing Config, restarting");
                wm.resetSettings();
                ESP.restart();
            }

            // start portal w delay
            Serial.println("Starting config portal");
            wm.setConfigPortalTimeout(120);
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("WiFiManager Mode");
            lcd.setCursor(0, 1);
            lcd.print("Unplug to exit");

            if (!wm.startConfigPortal(ssid, password))
            {
                lcd.clear();
                lcd.setCursor(0, 0);
                lcd.print("Failed");
                Serial.println("failed to connect or hit timeout");
                delay(3000);
                return;
            }
            else
            {
                lcd.clear();
                lcd.setCursor(0, 0);
                lcd.print("OKAY READY!!");
                lcd.setCursor(0, 1);
                lcd.print(":)");
                Serial.println("connected...yeey :)");
            }
        }
    }
}