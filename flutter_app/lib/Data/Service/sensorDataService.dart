import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_app/Data/Model/sensorData.dart';

class DataService {
  final String apiUrl = "http://10.0.129.187:3000/sensors";

  Future<Data?> fetchLastData() async {
    final response = await http.get(Uri.parse(apiUrl));

    if (response.statusCode == 200) {
      List<dynamic> data = jsonDecode(response.body);
      if (data.isNotEmpty) {
        return Data.fromJson(data.last); // Get the last entry in the list
      }
    }
    return null; // Return null if no data is found
  }
}


class ApiService {
  static const String url = 'http://10.0.129.187:3000/sensors';

  Future<List<Data>> fetchData() async {

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {

      List<dynamic> jsonData = json.decode(response.body);
      //print("Raw JSON data: $jsonData");
      return jsonData.map((json){
        //print("Raw item: $json");
      return Data.fromJson(json);}).toList();
    } else {
      throw Exception('Failed to load data');
    }
  }
}
