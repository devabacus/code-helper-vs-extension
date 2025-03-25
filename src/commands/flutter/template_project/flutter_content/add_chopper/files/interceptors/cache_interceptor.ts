export const cache_interceptor = `
import 'dart:async';

import 'package:chopper/chopper.dart';

class CacheInterceptor implements Interceptor {
  final Map<String, Response> _cache = {};

  @override
  FutureOr<Response<BodyType>> intercept<BodyType>(
    Chain<BodyType> chain,
  ) async {
    final request = chain.request;

    // Кэшируем только GET запросы
    if (request.method == 'GET') {
      final cacheKey = '\${request.method}:\${request.url}';

      // Возвращаем из кэша, если есть
      if (_cache.containsKey(cacheKey)) {
        return _cache[cacheKey] as Response<BodyType>;
      }

      // Получаем ответ и кэшируем
      final response = await chain.proceed(request);
      if (response.isSuccessful) {
        _cache[cacheKey] = response;
      }

      return response;
    }

    return chain.proceed(request);
  }
}

`;