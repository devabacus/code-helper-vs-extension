export class AuthFiles {
  /**
   * Файлы, которые не требуют никакой модификации.
   */
  public static readonly staticFiles: string[] = [
    't2/t2_flutter/lib/core/providers/serverpod_client_provider.dart',
    't2/t2_flutter/lib/core/providers/session_manager_provider.dart',
  ];

  /**
   * Файлы, в которых нужна простая замена текста.
   */
  public static readonly simpleReplaceFiles: string[] = [];

  /**
   * Файлы, для которых нужна замена по сложному паттерну.
   */
  public static readonly patternReplaceFiles: string[] = [];
}