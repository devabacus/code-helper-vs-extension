import { executeCommand } from "../../utils";
import { pubAddComm } from "./template_project/flutter_content/terminal_commands";


export async function addDriftDB(rootPath: string): Promise<void> {
    const command = `${pubAddComm}drift drift_flutter dev:drift_dev`;

    executeCommand(command, rootPath);

}

