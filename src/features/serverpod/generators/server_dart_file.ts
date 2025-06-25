export const serverFile = (projectName: string) => {
    return `
import 'package:serverpod/serverpod.dart';
import 'package:${projectName}_server/src/web/routes/root.dart';
import 'package:serverpod_auth_server/serverpod_auth_server.dart' as auth;
import 'src/generated/protocol.dart';
import 'src/generated/endpoints.dart';
import 'package:${projectName}_server/src/birthday_reminder.dart';

enum FutureCallNames {
  birthdayReminder,
}

void run(List<String> args) async {
  // --- ПРОВЕРЯЕМ РЕЖИМ ПЕРЕД ИНИЦИАЛИЗАЦИЕЙ ---
  // Ищем флаг --role и его значение 'maintenance' напрямую в аргументах
  // это нужно для deployment в kubernaties
  var isMaintenance = false;
  try {
    final roleIndex = args.indexOf('--role');
    if (roleIndex != -1 && args.length > roleIndex + 1) {
      if (args[roleIndex + 1] == 'maintenance') {
        isMaintenance = true;
      }
    }
  } catch (e) {
    // Игнорируем любые ошибки парсинга на этом этапе
  }
  // ------------------------------------------


  auth.AuthConfig.set(auth.AuthConfig(
    sendValidationEmail: (session, email, validationCode) async {
      print('Код подтверждения для $email: $validationCode');
      return true;
    },
    sendPasswordResetEmail: (session, userInfo, validationCode) async {
      print('Код сброса пароля для \${userInfo.email}: $validationCode');
      return true;
    },
  ));

  // Initialize Serverpod and connect it with your generated code.
  final pod = Serverpod(
    args,
    Protocol(),
    Endpoints(),
    authenticationHandler: auth.authenticationHandler,
  );



  if (!isMaintenance) {
    // Setup a default page at the web root.
    pod.webServer.addRoute(RouteRoot(), '/');
    pod.webServer.addRoute(RouteRoot(), '/index.html');
    // Serve all files in the /static directory.
    pod.webServer.addRoute(
      RouteStaticDirectory(serverDirectory: 'static', basePath: '/'),
      '/*',
    );
  }
  // ------------------------------------------

  // Start the server.
  await pod.start();

  // Настраиваем future calls, если они есть
  pod.registerFutureCall(
    BirthdayReminder(),
    FutureCallNames.birthdayReminder.name,
  );

  await pod.futureCallWithDelay(
    FutureCallNames.birthdayReminder.name,
    Greeting(
      message: 'Hello!',
      author: 'Serverpod Server',
      timestamp: DateTime.now(),
    ),
    Duration(seconds: 5),
  );
}
`;};