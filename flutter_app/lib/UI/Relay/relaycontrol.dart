import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_app/Data/Model/status.dart';
import 'package:flutter_app/Data/Service/StatusService.dart';
import 'package:flutter_app/DateTimeFormat.dart';
import 'package:flutter_app/Data/Service/MQTTService.dart';

class RelayControlPage extends StatefulWidget {
  const RelayControlPage({super.key});

  @override
  State<RelayControlPage> createState() => _RelayControlPage();
}

class _RelayControlPage extends State<RelayControlPage> {

  //...........
  final StatusService _statusService = StatusService();
  Status? _status;
  final PostApiService _postService = PostApiService();
  final _mqttService = MqttService();
  bool rl1=true;
  bool rl2=true;
  bool rl3=true;
  bool rl4=true;
  int id=0;
  Timer? _fetchtimer;
  //Timer? _pushtimer;

  // s='';
  @override
  void initState() {
    super.initState();
    _fetchLastStatus();
    _startFetchTimer();

    //_startPushTimer();
  }
  @override
  void dispose() {
    _fetchtimer?.cancel();
    //_pushtimer?.cancel();
    _mqttService.disconnect();
    super.dispose();
  }

  void _startFetchTimer() {
    _fetchtimer = Timer.periodic(Duration(seconds: 5), (timer) {
      _fetchLastStatus();
    });
  }
  //using timer to schedule not like expect
  /*void _startPushTimer() {
    _pushtimer?.cancel();
    _pushtimer = Timer(Duration(seconds: 5), () {
      _pushRelayState();
    });
  }*/
  void _fetchLastStatus() async {
    Status? status = await _statusService.fetchLastStatus();
    setState(() {
      _status = status;
      if (_status != null) {
        rl1 = _status!.relay1;
        rl2 = _status!.relay2;
        rl3 = _status!.relay3;
        rl4 = _status!.relay4;
        id=_status!.id;
      }
      //print("rl1: $rl1, rl2: $rl2, rl3: $rl3, rl4: $rl4");
      //print(
      //    "relay1: ${_status!.relay1}, relay2: ${_status!.relay2}, relay3: ${_status!.relay3}, relay4: ${_status!.relay4}");
    });
  }

  Future<void> _pushRelayState() async {
    final status = Status(
      relay1: rl1,
      relay2: rl2,
      relay3: rl3,
      relay4: rl4,
      timestamp: DateTime.now(),
      id: id+1, // Update this with the correct ID if needed
    );
    await _postService.pushRelayState(status);
    _mqttService.publishRelayState(rl1, rl2, rl3, rl4);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Relay Control'),
        centerTitle: true,
        backgroundColor: Colors.deepPurple,
      ),
      body:
          /* Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [Text('relay work')],
        ),
      ), */
          Column(
        children: [
          Expanded(
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    color: Colors.red,
                    child: _status == null
                        ? Center(
                      child: CircularProgressIndicator(),):
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Relay1:',style: TextStyle(
                            fontSize: 35
                          ),),
                          Switch(
                            value: rl1,
                            //value:_status!.relay1,
                            onChanged: (value) {
                              setState(() {
                                rl1 = value;
                              });
                              //_startPushTimer();
                              _pushRelayState();
                            },
                          ),
                          Text(
                            "Status ${rl1 ? 'On' : 'Off'}",
                            style: TextStyle(fontSize: 24, color: Colors.white),
                          ),
                          Icon(
                            rl1 ? Icons.check_circle : Icons.cancel,
                            color: Colors.white,
                            size: 48,
                          ),
                          Text('The last modify:',style:TextStyle(fontSize: 22),),
                          Text(
                            "${formatDayTime(_status!.timestamp)}",
                            //"$t",
                            style: TextStyle(fontSize: 20),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Container(
                    color: Colors.green,
                    child: _status == null
                        ? Center(
                      child: CircularProgressIndicator(),):
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Relay2:',style: TextStyle(
                              fontSize: 35
                          ),),
                          Switch(
                            value: rl2,
                            //value:_status!.relay2,
                            onChanged: (value) {
                              setState(() {
                                rl2 = value;
                              });
                              //_startPushTimer();
                              _pushRelayState();
                            },
                          ),
                          Text(
                            "Status ${rl2 ? 'On' : 'Off'}",
                            style: TextStyle(fontSize: 24, color: Colors.white),
                          ),
                          Icon(
                            rl2 ? Icons.check_circle : Icons.cancel,
                            color: Colors.white,
                            size: 48,
                          ),
                          Text('The last modify:',style:TextStyle(fontSize: 22),),
                          Text(
                            "${formatDayTime(_status!.timestamp)}",
                            style: TextStyle(fontSize: 20),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    color: Colors.blue,
                    child: _status == null
                        ? Center(
                      child: CircularProgressIndicator(),):
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Relay3:',style: TextStyle(
                              fontSize: 35
                          ),),
                          Switch(
                            value: rl3,
                            onChanged: (value) {
                              setState(() {
                                rl3 = value;
                              });
                              //_startPushTimer();
                              _pushRelayState();
                            },
                          ),
                          Text(
                            "Status ${rl3 ? 'On' : 'Off'}",
                            style: TextStyle(fontSize: 24, color: Colors.white),
                          ),
                          Icon(
                            rl3 ? Icons.check_circle : Icons.cancel,
                            color: Colors.white,
                            size: 48,
                          ),
                          Text('The last modify:',style:TextStyle(fontSize: 22),),
                          Text(
                            "${formatDayTime(_status!.timestamp)}",
                            style: TextStyle(fontSize: 20),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Container(
                    color: Colors.yellow,
                    child: _status == null
                        ? Center(
                      child: CircularProgressIndicator(),)
                        : Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text('Relay4:',style: TextStyle(
                                  fontSize: 35
                              ),),
                              Switch(
                                  //value: _status!.relay3,
                                value: rl4,
                                  onChanged: (value) {
                                    setState(() {
                                      rl4 = value;
                                    });
                                    //_startPushTimer();
                                    _pushRelayState();
                                  }),

                              Text(
                                "Status: ${rl4 ? 'On' : 'Off'}",
                                style: TextStyle(fontSize: 24),
                              ),
                              Icon(
                                rl4 ? Icons.check_circle : Icons.cancel,
                                color: Colors.white,
                                size: 48,
                              ),
                              Text('The last modify:',style:TextStyle(fontSize: 22),),
                              Text(
                                "${formatDayTime(_status!.timestamp)}",
                                style: TextStyle(fontSize: 20),
                              ),
                              //Text("$rl1 and $rl2 and $rl3 and $rl4"),
                              //Text("${_status!.relay1} and ${_status!.relay2} "
                              //    "and ${_status!.relay3} and ${_status!.relay4}")
                            ],
                          ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
