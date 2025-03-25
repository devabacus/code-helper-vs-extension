export const error_interceptor = `
import 'dart:async';
import 'dart:io';

import 'package:chopper/chopper.dart';
import 'package:chopper_arch/core/services/interceptors/error_interceptor/api_exception.dart';

// Теперь исправленный ErrorInterceptor
class ErrorInterceptor implements Interceptor {
  @override
  FutureOr<Response<BodyType>> intercept<BodyType>(
    Chain<BodyType> chain,
  ) async {
    try {
      final response = await chain.proceed(chain.request);

      if (response.statusCode >= 400) {
        // Обработка ошибок HTTP
        switch (response.statusCode) {
          case 401:
            throw UnauthorizedException('Не авторизован');
          case 403:
            throw ForbiddenException('Доступ запрещен');
          case 404:
            throw NotFoundException('Ресурс не найден');
          case 429:
            throw RateLimitException('Превышен лимит запросов');
          case 500:
          case 501:
          case 502:
          case 503:
            throw ServerException('Ошибка сервера: \${response.statusCode}');
          default:
            throw HttpException('HTTP ошибка: \${response.statusCode}');
        }
      }

      return response;
    } catch (e) {
      if (e is SocketException || e is TimeoutException) {
        throw NetworkException('Проблема с сетевым подключением');
      }
      rethrow;
    }
  }
}

`;