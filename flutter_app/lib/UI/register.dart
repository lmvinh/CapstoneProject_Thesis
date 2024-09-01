import 'dart:io';

import 'package:flutter/material.dart';
//import 'package:flutter/services.dart';
//import 'package:flutter_app/UI/Relay/relaycontrol.dart';
import 'package:flutter_app/UI/bottomnav.dart';



class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

  void _showExitDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Exit App'),
          content: Text('Do you really want to exit the app?'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text('No'),
            ),
            TextButton(
              onPressed: () {
                exit(0); // Exit the app
              },
              child: Text('Yes'),
            ),
          ],
        );
      },
    );
  }

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
            ElevatedButton(
                onPressed: () {
                  Navigator.of(context)
                      .push(MaterialPageRoute(builder: (BuildContext context) {
                    return const BottomNavPage();
                  }));
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.purple[200],
                    minimumSize: const Size(300, 40)),
                child: const Text('Registers')),
            ElevatedButton(
                onPressed: () {
                  //Navigator.of(context).pop();
                  //SystemNavigator.pop();
                  _showExitDialog(context);
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red[200],
                    minimumSize: const Size(300, 40)),
                child: const Text('Exit app')),
          ],
        ),
      ),
    );
  }
}
