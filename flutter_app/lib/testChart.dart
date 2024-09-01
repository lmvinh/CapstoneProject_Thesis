import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
void main() => runApp(MaterialApp(home: SimpleLineChart()));

class SimpleLineChart extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Simple Line Chart')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: LineChart(
          LineChartData(
            borderData: FlBorderData(
              show: true,
              border: Border.all(color: Colors.black26),
            ),
            gridData: FlGridData(show: true),
            titlesData: FlTitlesData(
              //leftTitles: SideTitles(showTitles: true),
              //bottomTitles: SideTitles(showTitles: true),
            ),
            minX: 0,
            maxX: 7,
            minY: 0,
            maxY: 6,
            lineBarsData: [
              LineChartBarData(
                spots: [
                  FlSpot(0, 3),
                  FlSpot(1, 1),
                  FlSpot(2, 4),
                  FlSpot(3, 3),
                  FlSpot(4, 5),
                  FlSpot(5, 4),
                  FlSpot(6, 3),
                ],
                isCurved: true,
                color: Colors.blue,
                barWidth: 3,
                isStrokeCapRound: true,
                dotData: FlDotData(show: false),
                belowBarData: BarAreaData(show: true, color:
                  Colors.blue.withOpacity(0.3),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

