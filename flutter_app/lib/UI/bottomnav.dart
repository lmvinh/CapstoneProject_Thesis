import 'package:flutter/material.dart';
import 'package:flutter_app/UI/Chart/chart.dart';
import 'package:flutter_app/UI/Relay/relaycontrol.dart';
import 'package:flutter_app/UI/Sensor/sensor.dart';
//import 'package:flutter_app/blank.dart';

class BottomNavPage extends StatefulWidget {
  const BottomNavPage({super.key});

  @override
  State<BottomNavPage> createState() => _BottomNavPageState();
}

class _BottomNavPageState extends State<BottomNavPage> {
  int _currentIndex = 0;
  static const List<Widget> _pages = <Widget>[
    RelayControlPage(),
    SensorPage(),
    ChartPage(),
    //BlankPage()
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: _pages.elementAt(_currentIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
              icon: Icon(
                Icons.home,
                color: Colors.green,
              ),
              label: 'Home'),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.airplay,
                color: Colors.green,
              ),
              label: 'Display'),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.bar_chart,
                color: Colors.green,
              ),
              label: 'Chart')
        ],
        currentIndex: _currentIndex,
        onTap: (int index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}
