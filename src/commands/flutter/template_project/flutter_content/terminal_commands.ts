

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

const regularPluginsCommand = `${startPlugins.join(' ')}`;
const devPluginsCommand = `${startDevPlugins.map((item: string) => `dev:${item} `).join('')}`;

export const addStartPlugins = `${pubAddComm}${regularPluginsCommand} ${devPluginsCommand}`;

