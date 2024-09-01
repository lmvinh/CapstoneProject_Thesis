
class Data {
  final double temp;
  final double humi;
  final DateTime timestamp;
  final int id;

  Data(
      {required this.temp,
        required this.humi,
        required this.timestamp,
        required this.id});

  factory Data.fromJson(Map<String, dynamic> json) {
    return Data(
      temp: (json['temp'] is int) ? (json['temp'] as int).toDouble() : json['temp'],
      humi: (json['humi'] is int) ? (json['humi'] as int).toDouble() : json['humi'],
      timestamp: DateTime.parse(json['timestamp']),
      id: json['id'],
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'temp': temp,
      'humi': humi,
      'timestamp': timestamp.toIso8601String(),
      'id': id,
    };
  }
}