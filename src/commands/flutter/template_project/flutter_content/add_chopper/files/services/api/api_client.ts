export const api_client = 
`
// ignore_for_file: unused_field
import 'package:chopper/chopper.dart';
import '../interceptors/x_api_key_interceptor.dart';
import '../interceptors/cache_interceptor.dart';
import '../interceptors/error_interceptor/error_interceptor.dart';
import '../interceptors/retry_interceptor.dart';

class ApiClient {
  final ChopperClient _client;
  
  ApiClient(this._client);

  factory ApiClient.create({
    String? baseUrl,
    bool enableLogging = true,
    String? apiKey
  }) {
    final client = ChopperClient(
      baseUrl: Uri.parse(baseUrl!),
      interceptors: [
        HttpLoggingInterceptor(),
        if (apiKey != null) ApiKeyInterceptor(apiKey: apiKey),
        CacheInterceptor(),
        RetryInterceptor(maxRetries: 3),
        ErrorInterceptor(),
      ],
      converter: JsonConverter(),
      services: [
 
      ],
    );
    
    return ApiClient(client);
  }
}

`;