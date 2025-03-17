import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getRootWorkspaceFolders } from '../../utils/path_util';

/**
 * Исправляет версию Android NDK в build.gradle.kts, заменяя flutter.ndkVersion на конкретное значение.
 */
export async function fixAndroidNDKVersion() {


    const projectPath = getRootWorkspaceFolders();
    const buildGradlePath = path.join(projectPath, 'android', 'app', 'build.gradle.kts');

    try {
        if (!fs.existsSync(buildGradlePath)) {
            vscode.window.showErrorMessage(`Файл build.gradle.kts не найден: ${buildGradlePath}`);
            return;
        }

        let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');

        // Если уже есть явное указание ndkVersion, ничего не делаем
        if (buildGradleContent.includes('ndkVersion = "27.0.12077973"')) {
            vscode.window.showInformationMessage('Версия NDK уже указана.');
            return;
        }

        // Заменяем flutter.ndkVersion на конкретную версию
        if (buildGradleContent.includes('ndkVersion = flutter.ndkVersion')) {
            buildGradleContent = buildGradleContent.replace(
                'ndkVersion = flutter.ndkVersion',
                'ndkVersion = "27.0.12077973"'
            );
        } else {
            // Добавляем ndkVersion внутрь android { }, если его не было
            buildGradleContent = buildGradleContent.replace(
                /android\s*{/, // Ищем android { и вставляем внутрь
                `android {\n    ndkVersion = "27.0.12077973"`
            );
        }

        fs.writeFileSync(buildGradlePath, buildGradleContent);

        vscode.window.showInformationMessage('Android NDK версия исправлена на 27.0.12077973.');

    } catch (error) {
        vscode.window.showErrorMessage(`Ошибка: ${error}`);
    }
}
