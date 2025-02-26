import {  
	commands,
	ExtensionContext,
	languages,
	window,
	workspace,
  } from "vscode";



export function activate(context: ExtensionContext) {

	console.log('Congratulations, your extension "code-helper" is now active!');

	const disposable = commands.registerCommand('code-helper.helloWorld', () => {
		window.showInformationMessage('Уже 4-е обновление, поздравляю!');
		console.log('привет ты запустил команду');
		
		
		
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
