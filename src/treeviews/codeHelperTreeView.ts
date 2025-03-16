import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getRootWorkspaceFolders } from '../utils/path_util';

export class CodeHelperTreeProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('Откройте проект для работы с Code Helper');
            return Promise.resolve([]);
        }

        if (element) {
            return this.getProjectItems(element);
        } else {
            return Promise.resolve(this.getProjectCategories());
        }
    }

    private getProjectCategories(): TreeItem[] {
        // Главные категории
        return [
            new TreeItem('Flutter', vscode.TreeItemCollapsibleState.Collapsed, 'category-flutter'),
            new TreeItem('Python', vscode.TreeItemCollapsibleState.Collapsed, 'category-python'),
            new TreeItem('VS Code Extension', vscode.TreeItemCollapsibleState.Collapsed, 'category-vscode')
        ];
    }

    private getProjectItems(element: TreeItem): Promise<TreeItem[]> {
        // Здесь определяем элементы внутри категорий
        switch(element.contextValue) {
            case 'category-flutter':
                return Promise.resolve([
                    new TreeItem('Новый проект', vscode.TreeItemCollapsibleState.None, 'command', {
                        command: 'code-helper.myFlutter',
                        title: 'Создать новый проект Flutter'
                    }),
                    new TreeItem('Добавить BLE', vscode.TreeItemCollapsibleState.None, 'command', {
                        command: 'code-helper.myFlutter',
                        title: 'Добавить BLE пакет'
                    })
                ]);
            case 'category-python':
                return Promise.resolve([
                    new TreeItem('Старт проекта', vscode.TreeItemCollapsibleState.None, 'command', {
                        command: 'code-helper.myPython',
                        title: 'Начать проект Python'
                    })
                ]);
            case 'category-vscode':
                return Promise.resolve([
                    new TreeItem('Переустановить расширение', vscode.TreeItemCollapsibleState.None, 'command', {
                        command: 'code-helper.vsCodeExtHandler',
                        title: 'Переустановить расширение'
                    })
                ]);
            default:
                return Promise.resolve([]);
        }
    }
}

export class TreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue: string,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        
        // Добавляем иконки в зависимости от типа элемента
        if (contextValue === 'category-flutter') {
            this.iconPath = new vscode.ThemeIcon('package');
        } else if (contextValue === 'category-python') {
            this.iconPath = new vscode.ThemeIcon('symbol-method');
        } else if (contextValue === 'category-vscode') {
            this.iconPath = new vscode.ThemeIcon('extensions');
        } else if (contextValue === 'command') {
            this.iconPath = new vscode.ThemeIcon('run');
        }
    }
}

export function registerTreeViewProvider(context: vscode.ExtensionContext) {
    let workspaceRoot = '';
    try {
        workspaceRoot = getRootWorkspaceFolders();
    } catch (error) {
        // Если рабочая область не открыта
        workspaceRoot = '';
    }

    const treeDataProvider = new CodeHelperTreeProvider(workspaceRoot);
    const treeView = vscode.window.createTreeView('codeHelperTreeView', { 
        treeDataProvider,
        showCollapseAll: true
    });

    context.subscriptions.push(
        vscode.commands.registerCommand('code-helper.refreshTreeView', () => {
            treeDataProvider.refresh();
        }),
        treeView
    );

    return treeDataProvider;
}