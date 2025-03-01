import * as vscode from "vscode";
import * as path from "path";
import { writeToTerminal } from "../../utils/terminal_handle";
import { getUserInput, pickPath } from "../../utils/ui/ui_util";


export async function flutterCreate() {
    const newProjectPath = await pickPath();
    if (!newProjectPath) {
        vscode.window.showErrorMessage("Путь к проекту не выбран!");
        return;
    }

    const projectName = await getUserInput("Название проекта");
    if (!projectName) {
        vscode.window.showErrorMessage("Название проекта не введено!");
        return;
    }

    const projectPath = path.join(newProjectPath, projectName);
    const mainFilePath = path.join(projectPath, "lib", "main.dart");

    // Команда для создания Flutter-проекта
    const flutterCreateCommand = `flutter create "${projectPath}"`;

    // Выполняем команду создания проекта в терминале
    writeToTerminal(flutterCreateCommand);

    // Открываем проект в VS Code API (без нового окна)
    await vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(projectPath), { forceNewWindow: false });

    // Делаем задержку, чтобы `main.dart` точно успел создаться
    setTimeout(async () => {
        try {
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(mainFilePath));
            await vscode.window.showTextDocument(doc, { preview: false });
        } catch (error) {
            vscode.window.showErrorMessage("Не удалось открыть main.dart: ");
        }
    }, 3000); // Ожидание 3 секунды перед открытием main.dart
}
