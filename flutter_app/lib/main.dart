import 'package:flutter/material.dart';
import 'package:flutter_app/UI/register.dart';
//import 'package:flutter_app/charttesting.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: false,
      ),
      //home: const FirstPage(),
      //home: LineChartSample3(),
      home: RegisterPage(),
    );
  }
}

class FirstPage extends StatelessWidget {
  const FirstPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.orange[100],
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Welcome',
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 55,
                  fontWeight: FontWeight.bold),
            ),
            const Text('to My App',
                style: TextStyle(color: Colors.white, fontSize: 45)),
            const SizedBox(height: 20),
            Image.asset('images/Regis.png'),
            const SizedBox(height: 20),
            ElevatedButton(onPressed: () {}, child: const Text('Registers'))
          ],
        ),
      ),
    );
  }
}
