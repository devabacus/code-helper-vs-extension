import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BlePermissionsBlock } from './flutter_constants';
import { executeCommand } from '../../utils';

/**
 * Выполняет команду в терминале и возвращает промис.
 */

/**
 * Добавляет зависимость ble_manager и Bluetooth разрешения в AndroidManifest.xml.
 */
export async function addBLePackage() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Откройте рабочую папку перед добавлением пакета.');
        return;
    }

    const projectPath = workspaceFolders[0].uri.fsPath;
    const pubspecPath = path.join(projectPath, 'pubspec.yaml');
    const androidManifestPath = path.join(projectPath, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

    try {
        // Шаг 1: Добавление зависимости в pubspec.yaml
        if (fs.existsSync(pubspecPath)) {
            let pubspecContent = fs.readFileSync(pubspecPath, 'utf8');

            if (!pubspecContent.includes('ble_manager:')) {
                // const newDependency = `  ble_manager:\n    git:\n      url: https://github.com/devabacus/ble_manager.git\n      ref: v0.0.2\n`;
                const newDependency = `  ble_manager:\n    git:\n      url: https://github.com/devabacus/ble_manager.git\n`;
                pubspecContent = pubspecContent.replace('dependencies:', `dependencies:\n${newDependency}`);
                fs.writeFileSync(pubspecPath, pubspecContent);
                vscode.window.showInformationMessage('Добавлена зависимость ble_manager в pubspec.yaml.');
            } else {
                vscode.window.showInformationMessage('Зависимость ble_manager уже присутствует в pubspec.yaml.');
            }
        } else {
            vscode.window.showErrorMessage(`Файл pubspec.yaml не найден в ${projectPath}`);
            return;
        }

        // Шаг 2: Добавление Bluetooth-разрешений в AndroidManifest.xml
        if (fs.existsSync(androidManifestPath)) {
            let manifestContent = fs.readFileSync(androidManifestPath, 'utf8');



            if (!manifestContent.includes('android.permission.BLUETOOTH_SCAN')) {
                manifestContent = manifestContent.replace(
                    /<application\b[^>]*>/,
                    BlePermissionsBlock + '\n$&'
                );
                fs.writeFileSync(androidManifestPath, manifestContent);
                vscode.window.showInformationMessage('Bluetooth-разрешения добавлены в AndroidManifest.xml.');
            } else {
                vscode.window.showInformationMessage('Bluetooth-разрешения уже присутствуют в AndroidManifest.xml.');
            }
        } else {
            vscode.window.showErrorMessage(`Файл AndroidManifest.xml не найден в ${androidManifestPath}`);
            return;
        }

        // Шаг 3: Выполнение flutter pub get
        await executeCommand('flutter pub get', projectPath);
        vscode.window.showInformationMessage('Зависимости обновлены с помощью flutter pub get.');

    } catch (error) {
        vscode.window.showErrorMessage(`Ошибка: ${error}`);
    }
}
