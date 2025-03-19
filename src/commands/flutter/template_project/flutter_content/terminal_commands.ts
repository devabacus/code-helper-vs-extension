

const startPlugins = [
    "flutter_riverpod",
    "riverpod_annotation",
    "hooks_riverpod",
    "freezed_annotation",
    "json_annotation",
    "go_router",
    "talker_flutter",
    "talker_riverpod_logger",
    "package_info_plus",
];

const startDevPlugins = [
    "riverpod_generator",
    "build_runner",
    "custom_lint",
    "riverpod_lint",
    "freezed",
    "json_serializable",
];

const pubAddComm = `flutter pub add `;
const pubAddDevComm = `flutter pub add --dev `;

const regularPluginsCommand = `${pubAddComm}${startPlugins.join(' ')}`;
const devPluginsCommand = `${pubAddDevComm}${startDevPlugins.join(' ')}`;
export const addStartPlugins = `${regularPluginsCommand} && ${devPluginsCommand}`;

