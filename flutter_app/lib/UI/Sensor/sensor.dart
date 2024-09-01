import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_app/Data/Model/sensorData.dart';
import 'package:flutter_app/Data/Service/sensorDataService.dart';
import 'package:flutter_app/DateTimeFormat.dart';
import 'package:syncfusion_flutter_gauges/gauges.dart';
import 'package:weather_icons/weather_icons.dart';
class SensorPage extends StatefulWidget {
  const SensorPage({super.key});

  @override
  State<SensorPage> createState() => _SensorPage();
}



class _SensorPage extends State<SensorPage> {

  final DataService _dataService = DataService();
  Data? _data;
  double temp_value = 0;
  double humi_value=0;
  int id=0;
  Timer? _fetchtimer;
  @override
  void initState() {
    super.initState();
    _fetchLastData();
    _startFetchTimer();

    //_startPushTimer();
  }
  @override
  void dispose() {
    _fetchtimer?.cancel();
    //_pushtimer?.cancel();

    super.dispose();
  }

  void _startFetchTimer() {
    _fetchtimer = Timer.periodic(Duration(seconds: 5), (timer) {
      _fetchLastData();
    });
  }
  void _fetchLastData() async {
    Data? data = await _dataService.fetchLastData();
    temp_value=data!.temp;
    setState(() {
      _data = data;
      if (_data != null) {
        temp_value = _data!.temp;
        humi_value = _data!.humi;
        id=_data!.id;
      }
      //print("rl1: $rl1, rl2: $rl2, rl3: $rl3, rl4: $rl4");
      //print(
      //    "relay1: ${_status!.relay1}, relay2: ${_status!.relay2}, relay3: ${_status!.relay3}, relay4: ${_status!.relay4}");
    });
  }





  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Display sensors data'),
        centerTitle: true,
        backgroundColor: Colors.deepPurple,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            //Text('Sensor work'),
            Expanded(
                child: Container(

                  color: Colors.greenAccent,
              child: _data == null
                  ? Center(
                child: CircularProgressIndicator(),)
                  : Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(WeatherIcons.thermometer),
                        Text(
                          'Temperature value:',
                          style:
                          TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),


                    Container(
                      width: 250,
                      height: 250,
                      child: _getTempRadialGauge(),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('The last modify:',style:TextStyle(fontSize: 30),),
                        Text("${formatDayTime(_data!.timestamp)}",
                      style: TextStyle(fontSize: 30),
                    ),

                      ],
                    )

                    /*Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('icon',style: TextStyle(fontSize: 20),),
                        Text(
                          'data',
                          style: TextStyle(fontSize: 40),
                        )
                      ],
                    )*/
                  ],
                ),
              ),
            )
            ),
            Expanded(
                child: Container(
              color: Colors.yellowAccent,
              child: _data == null
                  ? Center(
                  child: CircularProgressIndicator(),)
                  : Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(WeatherIcons.humidity),
                            Text(
                              'Humidity value:',
                              style:
                              TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),


                        Container(
                          width: 250,
                          height: 250,
                          child: _getHumiRadialGauge(),
                        ),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('The last modify:',style:TextStyle(fontSize: 30),),

                              Text("${formatDayTime(_data!.timestamp)}",
                                style: TextStyle(fontSize: 30),
                              ),

                          ],
                        )

                        /*Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('icon',style: TextStyle(fontSize: 20),),
                        Text(
                          'data',
                          style: TextStyle(fontSize: 40),
                        )
                      ],
                    )*/
                      ],
                    ),
                  ),
                )
            ),
          ],
        ),
      ),
    );





  }



  Widget _getTempRadialGauge() {
    return SfRadialGauge(

      /*title: GaugeTitle(

          text: 'Temperature',
          textStyle:
          const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold)),*/
        axes: <RadialAxis>[
          RadialAxis(minimum: 0, maximum: 120, ranges: <GaugeRange>[
            GaugeRange(
                startValue: 0,
                endValue: 40,
                color: Colors.green,
                startWidth: 10,
                endWidth: 10),
            GaugeRange(
                startValue: 40,
                endValue: 80,
                color: Colors.orange,
                startWidth: 10,
                endWidth: 10),
            GaugeRange(
                startValue: 80,
                endValue: 120,
                color: Colors.red,
                startWidth: 10,
                endWidth: 10)
          ], pointers: <GaugePointer>[
            NeedlePointer(value: temp_value)
          ], annotations: <GaugeAnnotation>[
            GaugeAnnotation(
                widget: Container(
                    child:  Text('$temp_value °C',
                        style: TextStyle(
                            fontSize: 35, fontWeight: FontWeight.bold))),
                angle: 90,
                positionFactor: 0.5)
          ])
        ]);}


  Widget _getHumiRadialGauge() {
    return SfRadialGauge(

      /*title: GaugeTitle(

          text: 'Temperature',
          textStyle:
          const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold)),*/
        axes: <RadialAxis>[
          RadialAxis(minimum: 0, maximum: 100, ranges: <GaugeRange>[
            GaugeRange(
                startValue: 0,
                endValue: 30,
                color: Colors.green,
                startWidth: 10,
                endWidth: 10),
            GaugeRange(
                startValue: 30,
                endValue: 70,
                color: Colors.orange,
                startWidth: 10,
                endWidth: 10),
            GaugeRange(
                startValue: 70,
                endValue: 100,
                color: Colors.red,
                startWidth: 10,
                endWidth: 10)
          ], pointers: <GaugePointer>[
            NeedlePointer(value: humi_value)
          ], annotations: <GaugeAnnotation>[
            GaugeAnnotation(
                widget: Container(
                    child:  Text('$humi_value %',
                        style: TextStyle(
                            fontSize: 30, fontWeight: FontWeight.bold))),
                angle: 90,
                positionFactor: 0.5)
          ])
        ]);}
}


