import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Исправляет NDK версию и обновляет Java версию в build.gradle.kts
 */
export async function fixAndroidNDKVersionAndJavaVersion() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Откройте рабочую папку перед исправлением NDK и Java версии.');
        return;
    }

    const projectPath = workspaceFolders[0].uri.fsPath;
    const buildGradlePath = path.join(projectPath, 'android', 'app', 'build.gradle.kts');

    try {
        if (!fs.existsSync(buildGradlePath)) {
            vscode.window.showErrorMessage(`Файл build.gradle.kts не найден: ${buildGradlePath}`);
            return;
        }

        let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');

        // 1. Исправляем NDK версию
        if (!buildGradleContent.includes('ndkVersion = "27.0.12077973"')) {
            if (buildGradleContent.includes('ndkVersion = flutter.ndkVersion')) {
                buildGradleContent = buildGradleContent.replace(
                    'ndkVersion = flutter.ndkVersion',
                    'ndkVersion = "27.0.12077973"'
                );
            } else {
                buildGradleContent = buildGradleContent.replace(
                    /android\s*{/,
                    `android {\n    ndkVersion = "27.0.12077973"`
                );
            }
        }

        // 2. Обновляем Java версию
        buildGradleContent = buildGradleContent.replace(
            /sourceCompatibility = JavaVersion\.VERSION_8/g,
            'sourceCompatibility = JavaVersion.VERSION_11'
        );
        buildGradleContent = buildGradleContent.replace(
            /targetCompatibility = JavaVersion\.VERSION_8/g,
            'targetCompatibility = JavaVersion.VERSION_11'
        );

        fs.writeFileSync(buildGradlePath, buildGradleContent);

        vscode.window.showInformationMessage('Исправлена версия NDK (27.0.12077973) и обновлена Java до версии 11.');

    } catch (error) {
        vscode.window.showErrorMessage(`Ошибка: ${error}`);
    }
}
