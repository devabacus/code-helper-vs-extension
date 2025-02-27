import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

/**
 * Выполняет команду в терминале и возвращает промис.
 */
function executeCommand(command: string, cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Ошибка: ${stderr || error.message}`);
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

/**
 * Исправляет NDK версию и обновляет Java версию в build.gradle.kts и gradle.properties.
 */
export async function fixJavaAndNDKVersion() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Откройте рабочую папку перед исправлением NDK и Java версии.');
        return;
    }

    const projectPath = workspaceFolders[0].uri.fsPath;
    const buildGradlePath = path.join(projectPath, 'android', 'app', 'build.gradle.kts');
    const gradlePropertiesPath = path.join(projectPath, 'android', 'gradle.properties');

    try {
        // --- 1. Исправляем build.gradle.kts ---
        if (fs.existsSync(buildGradlePath)) {
            let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');

            // Исправляем NDK версию
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

            // Исправляем Java версию
            buildGradleContent = buildGradleContent.replace(
                /sourceCompatibility = JavaVersion\.VERSION_8/g,
                'sourceCompatibility = JavaVersion.VERSION_11'
            );
            buildGradleContent = buildGradleContent.replace(
                /targetCompatibility = JavaVersion\.VERSION_8/g,
                'targetCompatibility = JavaVersion.VERSION_11'
            );

            fs.writeFileSync(buildGradlePath, buildGradleContent);
            vscode.window.showInformationMessage('Исправлена версия NDK и обновлена Java до 11.');
        }

        // --- 2. Исправляем gradle.properties ---
        if (fs.existsSync(gradlePropertiesPath)) {
            let gradlePropertiesContent = fs.readFileSync(gradlePropertiesPath, 'utf8');

            if (gradlePropertiesContent.includes('org.gradle.java.home')) {
                gradlePropertiesContent = gradlePropertiesContent.replace(
                    /org.gradle.java.home=.*/g,
                    '# org.gradle.java.home удалено (используется системная версия)'
                );
                fs.writeFileSync(gradlePropertiesPath, gradlePropertiesContent);
                vscode.window.showInformationMessage('Удалена устаревшая настройка Java в gradle.properties.');
            }
        }

        // --- 3. Запускаем flutter clean и flutter pub get ---
        await executeCommand('flutter clean', projectPath);
        await executeCommand('flutter pub get', projectPath);

    } catch (error) {
        vscode.window.showErrorMessage(`Ошибка: ${error}`);
    }
}
