

class Status {
  final bool relay1;
  final bool relay2;
  final bool relay3;
  final bool relay4;
  final DateTime timestamp;
  final int id;

  Status(
      {required this.relay1,
      required this.relay2,
      required this.relay3,
      required this.relay4,
      required this.timestamp,
      required this.id});

  factory Status.fromJson(Map<String, dynamic> json) {
    return Status(
      relay1: json['relay1'],
      relay2: json['relay2'],
      relay3: json['relay3'],
      relay4: json['relay4'],
      timestamp: DateTime.parse(json['timestamp']),
      id: json['id'],
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'relay1': relay1,
      'relay2': relay2,
      'relay3': relay3,
      'relay4': relay4,
      'timestamp': timestamp.toIso8601String(),
      'id': id,
    };
  }
}

class Album {
  final int userId;
  final int id;
  final String title;

  const Album({
    required this.userId,
    required this.id,
    required this.title,
  });

  factory Album.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'userId': int userId,
        'id': int id,
        'title': String title,
      } =>
        Album(
          userId: userId,
          id: id,
          title: title,
        ),
      _ => throw const FormatException('Failed to load album.'),
    };
  }
}
