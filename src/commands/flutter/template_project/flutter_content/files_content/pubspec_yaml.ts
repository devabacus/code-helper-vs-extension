export const pubspec_yaml = (projName: string, description: string = "Flutter Project") => {
    
return `
name: ${projName}
description: "${description}"

publish_to: 'none' 

version: 1.0.0+1

environment:
  sdk: ^3.7.0
  flutter: ">=3.10.0"

dependencies:
  common_package:
    path: ../Packages/common_package
  simple_storage:
    path: ../Packages/simple_storage  
  mlogger:
    git:
      url: https://github.com/devabacus/mlogger.git
      ref: v0.0.1

  flutter:
    sdk: flutter
    
  cupertino_icons: ^1.0.8
  
  flutter_riverpod: ^2.6.1
  riverpod_annotation: ^2.6.1
  hooks_riverpod: ^2.6.1
  
  freezed_annotation: ^3.0.0
  json_annotation: ^4.9.0
  
  go_router: ^14.8.1

  package_info_plus: ^8.3.0
  talker_flutter: ^4.7.1
  talker_riverpod_logger: ^4.7.1

  chopper: ^8.1.0
  chopper_generator: ^8.1.0

  drift: ^2.26.0
  drift_flutter: ^0.2.4
  
  path_provider: ^2.1.5

dev_dependencies:
  flutter_test:
    sdk: flutter

  build_runner: ^2.4.15
  flutter_lints: ^5.0.0
  riverpod_generator: ^2.6.5
  custom_lint: ^0.7.5
  riverpod_lint: ^2.6.5
  freezed: ^3.0.4
  json_serializable: ^6.9.4

  drift_dev: ^2.26.0

flutter:
  uses-material-design: true

`;};