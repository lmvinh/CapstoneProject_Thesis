// api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_app/Data/Model/status.dart';


class StatusService {
  final String apiUrl = "http://10.0.129.187:3000/relay-status";

  Future<Status?> fetchLastStatus() async {
    final response = await http.get(Uri.parse(apiUrl));

    if (response.statusCode == 200) {
      List<dynamic> data = jsonDecode(response.body);
      if (data.isNotEmpty) {
        return Status.fromJson(data.last); // Get the last entry in the list
      }
    }
    return null; // Return null if no data is found
  }
}
class PostApiService {
  final String apiUrl =
      'http://10.0.129.187:3000/relay-status'; // Replace with your API URL

  Future<void> pushRelayState(Status status) async {
    final response = await http.post(
      Uri.parse(apiUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(status.toJson()),
    );

    if (response.statusCode == 200) {
      print('Relay state pushed successfully');
    } else {
      print('Failed to push relay state');
    }
  }
}
