import 'package:mqtt_client/mqtt_client.dart';
import 'package:mqtt_client/mqtt_server_client.dart';

class MqttService {
  late MqttServerClient _mqttClient;

  MqttService() {
    _initializeMqtt();
  }

  void _initializeMqtt() async {
    _mqttClient = MqttServerClient(
        '250b3bef1ac048d9bc134e6f8a995753.s1.eu.hivemq.cloud',
        'flutter_client');
    _mqttClient.port = 8883;
    _mqttClient.secure = true; // Enable secure connection
    _mqttClient.onDisconnected = _onDisconnected;
    _mqttClient.logging(on: true);
    _mqttClient.keepAlivePeriod = 20;
    _mqttClient.connectionMessage = MqttConnectMessage()
        .withClientIdentifier('flutter_client')
        .authenticateAs('flutter_account', 'Flutter123')
        .startClean()
        .withWillQos(MqttQos.atMostOnce);

    try {
      await _mqttClient.connect();
      if (_mqttClient.connectionStatus!.state ==
          MqttConnectionState.connected) {
        print('MQTT Client connected');
      } else {
        print(
            'MQTT Client connection failed - status is ${_mqttClient.connectionStatus}');
        _mqttClient.disconnect();
      }
    } catch (e) {
      print('Exception: $e');
      _mqttClient.disconnect();
    }
  }

  void _onDisconnected() {
    print('MQTT Client disconnected');
  }

  void publishRelayState(bool relay1, bool relay2, bool relay3, bool relay4) {
    const topic = 'relay';
    final mqttPayload =
        '{"relay1":$relay1,"relay2":$relay2,"relay3":$relay3,"relay4":$relay4}';
    final builder = MqttClientPayloadBuilder();
    builder.addString(mqttPayload);
    _mqttClient.publishMessage(topic, MqttQos.atMostOnce, builder.payload!);
  }

  void disconnect() {
    _mqttClient.disconnect();
  }
}
//testing in testMQTT---------------
Future<void> connectAndSendMessage() async {

  final client = MqttServerClient(
      '250b3bef1ac048d9bc134e6f8a995753.s1.eu.hivemq.cloud',
      'flutter_client'); // Use 8883 for secure connection (TLS/SSL)
  client.secure = true;
  client.port = 8883;
  client.keepAlivePeriod = 60;
  client.onConnected = () {
    print('Connected');
  };
  client.onDisconnected = () {
    print('Disconnected');
  };
  client.logging(on: true);

  final connMessage = MqttConnectMessage()
      .withClientIdentifier('flutter_client')
      .withWillTopic('willtopic')
      .withWillMessage('My Will message')
      .startClean()
      .authenticateAs('flutter_account', 'Flutter123')
      .withWillQos(MqttQos.atLeastOnce);
  client.connectionMessage = connMessage;

  try {
    await client.connect();
  } catch (e) {
    print('Exception: $e');
    client.disconnect();
  }

  if (client.connectionStatus!.state == MqttConnectionState.connected) {
    print('MQTT client connected');
    sendMessage(client);
  } else {
    print(
        'ERROR: MQTT client connection failed - disconnecting, status is ${client.connectionStatus}');
    client.disconnect();
  }
}

void sendMessage(MqttServerClient client) {
  const topic = 'test'; // Set the topic here
  final builder = MqttClientPayloadBuilder();
  builder.addString('Hello, MQTT Broker!');
  client.publishMessage(topic, MqttQos.atMostOnce, builder.payload!);
  print('Message sent to $topic');
}
