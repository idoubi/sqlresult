// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sqlresult" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('sqlresult.tocsv', async () => {
		let editor = vscode.window.activeTextEditor
		let selection = editor?.selection
		let text = editor?.document.getText(selection)

		let arr = text?.match(/\|((.*)\|){1,}/g)
		let newArr: string[] = []

		arr?.forEach(function (item, i) {
			let str = item.replace(/\s*\|\s*/g, ',')
			str = str.replace(/^\,/, '').replace(/\,$/, '')
			newArr.push(str)
		})

		let content = newArr.join('\n')

		if (content == '') {
			vscode.window.showErrorMessage('invalid content')
			return
		}

		let uri = await vscode.window.showSaveDialog({
			filters: {
				csv: ['csv']
			}
		})

		if (uri == undefined) {
			vscode.window.showErrorMessage('invalid save path')
			return
		}

		let writeData = Buffer.from(content, 'utf8');
		vscode.workspace.fs.writeFile(uri, writeData);

		// Display a message box to the user
		let openFile = 'Open File'
		vscode.window.showInformationMessage('file saved', openFile).then((value) => {
			if (value === openFile) {
				vscode.window.showTextDocument(uri!, {

				})
			}
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
