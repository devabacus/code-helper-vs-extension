export const bearer_token_interceptor = `
import 'dart:async';

import 'package:chopper/chopper.dart';

class BearerTokenInterceptor implements Interceptor {
  final String token;

  BearerTokenInterceptor({required this.token});

  @override
  FutureOr<Response<BodyType>> intercept<BodyType>(Chain<BodyType> chain) {
    final request = applyHeader(
      chain.request,
      'Authorization',
      'Bearer $token',
    );
    return chain.proceed(request);
  }
}

`;