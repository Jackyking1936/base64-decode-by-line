// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('base64-line-decoder.decodeLines', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {return;}

        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection);

        const lines = selectedText.split(/\r?\n/);
        const decodedLines = lines.map(line => {
			try {
				const buf = Buffer.from(line.trim(), 'base64');
				const text = buf.toString('utf-8');
				if (/�/.test(text)) {throw new Error("contains replacement character");}
				return text;
			} catch (e) {
				return `[decode error] ${line}`;
			}
		});

        editor.edit(editBuilder => {
            editBuilder.replace(selection, decodedLines.join('\n'));
        });
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
