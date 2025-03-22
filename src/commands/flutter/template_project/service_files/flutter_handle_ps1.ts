export const flutter_handle_ps1 = `

# после обновления пакета
flutter pub cache clean
flutter clean
flutter pub get

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';


dart run build_runner build
dart run build_runner watch -d


flutter pub run build_runner build --delete-conflicting-outputs

flutter pub run build_runner watch --delete-conflicting-outputs


flutter pub add http
`;