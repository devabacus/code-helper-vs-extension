export const flutter_handle_ps1 = `
# после обновления пакета
flutter pub cache clean
flutter clean
flutter pub get

# serverpod
docker compose up -d
serverpod create-migration --experimental-features=all
serverpod generate --experimental-features=all
dart bin/main.dart --apply-migrations


dart run build_runner build --delete-conflicting-outputs
dart run build_runner watch -d

flutter pub run build_runner build --delete-conflicting-outputs
flutter pub run build_runner watch --delete-conflicting-outputs

flutter pub upgrade 
flutter pub upgrade --major-versions

`;