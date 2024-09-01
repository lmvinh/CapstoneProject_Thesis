import 'package:intl/intl.dart';

String formatDayTime(DateTime datetime) {
  return DateFormat('dd/MM/yy HH:mm:ss').format(datetime.toLocal());
}

String formatChartTimestamp(DateTime timestamp) {
  return DateFormat('HH:mm:ss').format(timestamp.toLocal());
}