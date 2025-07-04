export const user_manager_endpoint_file = (projectName: string) => {
return `
import 'package:serverpod/serverpod.dart';
import 'package:${projectName}_server/src/generated/protocol.dart';

typedef AuthenticatedUserContext = ({int userId, UuidValue customerId /*, List<String> activePermissions */});


class UserManagementEndpoint extends Endpoint {
  /// Возвращает данные о клиенте (customer) и правах доступа
  /// для текущего аутентифицированного пользователя.
  /// Клиент должен вызывать этот метод сразу после входа.
  Future<UserSessionData?> getMyUserContext(Session session) async {
    final authInfo = await session.authenticated;
    final userId = authInfo?.userId;

    // Если по какой-то причине ID пользователя не найден, выходим
    if (userId == null) {
      return null;
    }

    try {
      // Ищем связь пользователя с клиентом (customer)
      final customerUser = await CustomerUser.db.findFirstRow(
        session,
        where: (cu) => cu.userId.equals(userId),
      );
    
      if (customerUser == null) {
        session.log('User $userId is not associated with any customer.');
        return null;
      }

      // Находим права доступа для роли пользователя
      final permissions = await RolePermission.db.find(
        session,
        where: (rp) => rp.roleId.equals(customerUser.roleId),
      );

      final permissionKeys = <String>{};
      if (permissions.isNotEmpty) {
        final permissionIds = permissions.map((p) => p.permissionId).toSet();
        final permissionRecords = await Permission.db.find(
          session,
          where: (p) => p.id.inSet(permissionIds),
        );
        permissionKeys.addAll(permissionRecords.map((p) => p.key));
      }

      // Формируем и возвращаем объект с полным контекстом пользователя
      return UserSessionData(
        userId: userId,
        customerId: customerUser.customerId,
        roleId: customerUser.roleId,
        activePermissions: permissionKeys.toList(),
      );
    } catch (e, stackTrace) {
      session.log(
        'Error fetching user context for userId: $userId',
        level: LogLevel.error,
        exception: e,
        stackTrace: stackTrace,
      );
      return null;
    }
  }
}
`;};