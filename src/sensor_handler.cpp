#include "sensor_handler.h"


extern SHT4X sht4;
extern BMP280 bmp;


void sensorSetup() {
    if (!sht4.begin(&Wire, SHT40_I2C_ADDR_44, 25, 21, 400000U)) {
        Serial.println("Couldn't find SHT4x");
        while (1) delay(1);
    }
    
    sht4.setPrecision(SHT4X_HIGH_PRECISION);
    sht4.setHeater(SHT4X_NO_HEATER);

    if (!bmp.begin(&Wire, BMP280_I2C_ADDR, 25, 21, 400000U)) {
        Serial.println("Couldn't find BMP280");
        while (1) delay(1);
    }
    
    bmp.setSampling(BMP280::MODE_NORMAL, 
                    BMP280::SAMPLING_X2,     
                    BMP280::SAMPLING_X16,    
                    BMP280::FILTER_X16,      
                    BMP280::STANDBY_MS_500); 
}

void performPeriodicMeasurements() {
    if (sht4.update() && bmp.update()) {
        // Do the measurement and publish the data
    }
}