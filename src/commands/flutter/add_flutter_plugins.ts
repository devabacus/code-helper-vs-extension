import { executeCommand } from "../../utils";




const startCommands = "flutter pub add flutter_riverpod riverpod_annotation hooks_riverpod freezed_annotation json_annotation go_router talker_flutter talker_riverpod_logger";
const devPLugin = "flutter pub add --dev riverpod_generator build_runner custom_lint riverpod_lint freezed json_serializable";

export async function addStartPlugins(fullProjectPath: string) {
    const plugins = startCommands + "&&" + devPLugin;
    await executeCommand(plugins, fullProjectPath);
    
}
