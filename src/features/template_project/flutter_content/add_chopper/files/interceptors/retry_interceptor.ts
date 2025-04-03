export const retry_interceptor = `
import 'dart:async';
import 'dart:io';

import 'package:chopper/chopper.dart';

import 'error_interceptor/api_exception.dart';

class RetryInterceptor implements Interceptor {
  final int maxRetries;
  final Duration retryDelay;

  RetryInterceptor({
    this.maxRetries = 3,
    this.retryDelay = const Duration(seconds: 1),
  });

  @override
  FutureOr<Response<BodyType>> intercept<BodyType>(
    Chain<BodyType> chain,
  ) async {
    int attempts = 0;
    while (true) {
      attempts++;
      try {
        return await chain.proceed(chain.request);
      } catch (e) {
        if (attempts >= maxRetries ||
            !(e is SocketException ||
                e is TimeoutException ||
                e is ServerException)) {
          rethrow;
        }

        await Future.delayed(retryDelay * attempts); // Прогрессивная задержка
      }
    }
  }
}

`;