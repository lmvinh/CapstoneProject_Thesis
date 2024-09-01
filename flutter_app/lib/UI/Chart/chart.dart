import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/Data/Model/sensorData.dart';
import 'package:flutter_app/Data/Service/sensorDataService.dart';
import 'package:flutter_app/DateTimeFormat.dart';
import 'package:intl/intl.dart';
import 'dart:async';

class ChartPage extends StatefulWidget {
  const ChartPage({super.key});

  @override
  State<ChartPage> createState() => _ChartPage();
}

class _ChartPage extends State<ChartPage> {
  //copy here
  DateTime selectedDate = DateTime.now();
  DateTime selectedDateUTC = DateTime.now();
  List<Data> allData = [];
  List<Data> beforeData = [];
  List<Data> filteredData = [];
  Timer? _timer;
  bool isLoading = true;
  double temp_value = 0;

  //final DataService _dataService = DataService();

  @override
  void initState() {
    super.initState();
    _fetchData();
    _fetchTimer();
    //_fetch();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _fetchTimer() {
    _timer = Timer.periodic(Duration(seconds: 5), (timer) {
      _fetchData();
    });
  }

  /*void _fetch() async {
    Data? data = await _dataService.fetchLastData();
    temp_value = data!.temp;
    print("value : $temp_value, timeStamp:${data.timestamp}");
  }*/

  Future<void> _fetchData() async {
    try {
      allData = await ApiService().fetchData();

      /*allData.forEach((data) {
        print("Fetched data: ${data.temp}°C, ${data.humi}%, Timestamp: ${data.timestamp}");
      });*/
      _filterData();
    } catch (e) {
      print("Error fetching data: $e");
    }
  }

  void _filterData() {
    selectedDateUTC = selectedDate.toUtc();
    beforeData = allData.map((data) {
      return Data(
        temp: data.temp,
        humi: data.humi,
        timestamp: data.timestamp.toLocal(), // Convert to local time
        id: data.id,
      );
    }).toList();
    setState(() {
      filteredData = beforeData.where((data) {
        return data.timestamp.day == selectedDate.day &&
            data.timestamp.month == selectedDate.month &&
            data.timestamp.year == selectedDate.year;
      }).toList();
      /*filteredData = beforeData.map((data) {
        return Data(
          temp: data.temp,
          humi: data.humi,
          timestamp: data.timestamp.toLocal(), // Convert to local time
          id: data.id,
        );
      }).toList();*/

      isLoading = false;
      print("Filtered data count: ${filteredData.length}");
      //Data? data =  _dataService.fetchLastData();
      //print("Fetched data: ${data!.temp}°C, ${data.humi}%, Timestamp: ${data.timestamp}");
    });
  }

  _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
        isLoading = true;
      });
      print("Selected date: $selectedDate");
      _filterData();
    }
  }

  //widget  below
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Chart Display Page '),
          centerTitle: true,
          backgroundColor: Colors.deepPurple,
          actions: [
            IconButton(
              icon: Icon(Icons.calendar_today),
              onPressed: () => _selectDate(context),
            ),
          ],
        ),

        //body here
        body: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  'Sensor data day ${DateFormat('dd-MM-yyyy').format(selectedDate)}',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ),
              Expanded(
                  child: isLoading
                      ? Center(
                          child:
                              CircularProgressIndicator(), // Show loading spinner
                        )
                      : filteredData.isEmpty
                          ? Center(
                              child: Text(
                                'Don\'t have data on ${DateFormat('dd-MM-yyyy').format(selectedDate)}',
                                style:
                                    TextStyle(fontSize: 18, color: Colors.red),
                                textAlign: TextAlign.center,
                              ),
                            )
                          : Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: LineChart(LineChartData(
                                  gridData: FlGridData(show: false),
                                  titlesData: FlTitlesData(
                                      show: true,
                                      topTitles: AxisTitles(
                                          sideTitles:
                                              SideTitles(showTitles: false)),
                                      rightTitles: AxisTitles(
                                          sideTitles:
                                              SideTitles(showTitles: false)),
                                      bottomTitles: AxisTitles(
                                          sideTitles: SideTitles(
                                              showTitles: true,
                                              interval: 3600 * 1000,
                                              getTitlesWidget: (value, meta) {
                                                /*DateTime date =
                                            DateTime.fromMillisecondsSinceEpoch(
                                                value.toInt());
                                        return Text(
                                          //formatChartTimestamp(date),
                                          DateFormat('HH:mm:ss').format(date),
                                          style: TextStyle(fontSize: 10),
                                        );*/
                                                final DateTime startDate =
                                                    DateTime(
                                                  selectedDate.year,
                                                  selectedDate.month,
                                                  selectedDate.day,
                                                );

                                                final int hour = ((value -
                                                            startDate
                                                                .millisecondsSinceEpoch) /
                                                        (3600 * 1000))
                                                    .round();
                                                return Text(
                                                  '${hour}h',
                                                  style:
                                                      TextStyle(fontSize: 10),
                                                );
                                              }))),
                                  borderData: FlBorderData(show: true),
                                  lineBarsData: [
                                    LineChartBarData(
                                      spots: filteredData.map((data) {
                                        print("timestamp: ${data.timestamp}");
                                        return FlSpot(
                                          data.timestamp.millisecondsSinceEpoch
                                              .toDouble(),
                                          data.temp,
                                        );
                                      }).toList(),
                                      isCurved: true,
                                      preventCurveOverShooting: true,
                                      barWidth: 3,
                                      color: Colors.blue,
                                      dotData: FlDotData(show: true),
                                    ),
                                    LineChartBarData(
                                      spots: filteredData.map((data) {
                                        return FlSpot(
                                          data.timestamp.millisecondsSinceEpoch
                                              .toDouble(),
                                          data.humi,
                                        );
                                      }).toList(),
                                      isCurved: true,
                                      preventCurveOverShooting: true,
                                      barWidth: 3,
                                      color: Colors.green,
                                      dotData: FlDotData(show: true),
                                    ),
                                  ],
                                  lineTouchData: LineTouchData(
                                    enabled: true,
                                    touchTooltipData: LineTouchTooltipData(
                                      fitInsideHorizontally: true,
                                      fitInsideVertically: true,

                                      //tooltipBgColor: Colors.blueAccent,
                                      getTooltipItems: (touchedSpots) {
                                        return touchedSpots.map((touchedSpot) {
                                          final DateTime date = DateTime
                                              .fromMillisecondsSinceEpoch(
                                                  touchedSpot.x.toInt());
                                          final String formattedDate =
                                              formatChartTimestamp(date);
                                          String label;
                                          if (touchedSpot.barIndex == 0) {
                                            // Temperature line
                                            label =
                                                'Temp value at ${formattedDate} :'
                                                '\n ${touchedSpot.y.toStringAsFixed(2)}°C';
                                          } else {
                                            // Humidity line
                                            label =
                                                'Humi value at ${formattedDate} :'
                                                '\n ${touchedSpot.y.toStringAsFixed(2)}%';
                                          }
                                          return LineTooltipItem(
                                            ' $label',
                                            TextStyle(color: Colors.white),
                                          );
                                          //return tooltipItems();
                                        }).toList();
                                      },
                                    ),
                                    touchCallback: (FlTouchEvent event,
                                        LineTouchResponse? touchResponse) {
                                      if (!event.isInterestedForInteractions ||
                                          touchResponse == null ||
                                          touchResponse.lineBarSpots == null) {
                                        return;
                                      }
                                    },
                                    handleBuiltInTouches:
                                        true, // This enables the default touch handling
                                  ),
                                  minX: filteredData
                                      .first.timestamp.millisecondsSinceEpoch
                                      .toDouble(),
                                  maxX: filteredData
                                      .last.timestamp.millisecondsSinceEpoch
                                      .toDouble(),
                                  minY: 0,
                                  maxY: 100)),

                              /*body: isLoading
                          ? Center(child: CircularProgressIndicator())
                          : filteredData.isEmpty
                          ? Center(child: Text('No data available for the selected date'))
                          : ListView.builder(
                itemCount: filteredData.length,
                itemBuilder: (context, index) {
                          final data = filteredData[index];
                          return ListTile(
                            title: Text(
            'Timestamp: ${DateFormat('yyyy-MM-dd HH:mm:ss').format(data.timestamp)}',
                            ),
                            subtitle: Text('Temperature: ${data.temp}°C, Humidity: ${data.humi}%'),
                          );
                },
              ),*/

                              // end body
                            ))
            ])));
  }
}
