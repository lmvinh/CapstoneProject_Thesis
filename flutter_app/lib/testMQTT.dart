import 'package:flutter/material.dart';

import 'Data/Service/MQTTService.dart';

void main() {
  runApp(MyApp());
  connectAndSendMessage();
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('MQTT Client'),
        ),
        body: Center(
          child: Text('Sending message to MQTT broker...'),
        ),
      ),
    );
  }
}