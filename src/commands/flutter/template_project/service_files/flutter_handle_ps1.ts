export const flutter_handle_ps1 = `
# после обновления пакета
flutter pub cache clean
flutter clean
flutter pub get

dart run build_runner build
dart run build_runner watch -d

flutter pub run build_runner build --delete-conflicting-outputs
flutter pub run build_runner watch --delete-conflicting-outputs

flutter pub upgrade 
flutter pub upgrade --major-versions

`;