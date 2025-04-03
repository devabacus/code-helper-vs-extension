export const x_api_key_interceptor = `
import 'dart:async';

import 'package:chopper/chopper.dart';

class ApiKeyInterceptor implements Interceptor {
  final String apiKey;

  ApiKeyInterceptor({required this.apiKey});

  @override
  FutureOr<Response<BodyType>> intercept<BodyType>(Chain<BodyType> chain) {
    final request = applyHeader(chain.request, 'x-api-key', apiKey);
    return chain.proceed(request);
  }
}
`;