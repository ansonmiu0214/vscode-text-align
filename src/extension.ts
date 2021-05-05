// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { platform } from "os";

import {
	Alignment,
	leftAlign,
	centerAlign,
	rightAlign,
} from "./alignments";
import Config from "./config";
import {
	formatPathLink,
	getMaxLineLength,
	updateMaxLineLength,
	validateMaxLineLength,
} from "./utils";

interface Command {
	name: string;
	callback: (...args: any[]) => any;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "text-align" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	const outputChannel = vscode.window.createOutputChannel('Text Align');

	const alignmentCommands = [leftAlign, centerAlign, rightAlign]
		.map(alignment => {
			const { name, callback } = buildAlignmentCommand(alignment, outputChannel);
			return vscode.commands.registerCommand(
				`${Config.EXTENSION_NAME}.${name}`,
				callback
			);
		});

	context.subscriptions.push(
		...alignmentCommands,
		vscode.commands.registerCommand(
			'text-align.configureMaxLineLength',
			promptUserToConfigureMaxLineLength,
		),
	);
}

function buildAlignmentCommand(
	alignment: Alignment,
	outputChannel: vscode.OutputChannel
): Command {
	const { name, computePadding } = alignment;
	const callback = async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		console.log(editor.selections);
		console.log(editor.selections[0].isEmpty);

		if (editor.selections.every(selection => selection.isEmpty)) {
			vscode.window.showErrorMessage('No selections to align.');
			return;
		}

		const maxLineLength = getMaxLineLength();

		let allEditsCanBeApplied = true;
		for (const selection of editor.selections) {
			const replacement = alignText(
				computePadding(maxLineLength),
				editor,
				editor.document,
				selection
			);

			const editCanBeApplied = await replacement;
			allEditsCanBeApplied &&= allEditsCanBeApplied;
			
			if (!editCanBeApplied) {
				const filePosition = formatPathLink(
					platform(),
					editor.document.uri.fsPath,
					selection.start.line + 1,
					selection.start.character + 1,
				);
				
				outputChannel.appendLine(`${filePosition}: unable to align.`);
			}
		}

		if (!allEditsCanBeApplied) {
			vscode.window.showErrorMessage('Unable to apply all edits.');
			outputChannel.show();
		}
	};

	return {
		name,
		callback,
	};
}

async function promptUserToConfigureMaxLineLength() {
	const lineLength = await vscode.window.showInputBox({
		prompt: 'Maximum Line Length',
		placeHolder: String(getMaxLineLength()),
		validateInput(value) {
			try {
				validateMaxLineLength(value);
				return null;
			} catch (error) {
				return (error as Error).message;
			}
		}
	});
	
	await updateMaxLineLength(Number(lineLength));
}

function alignText(
	computePaddedLineLength: (lineLength: number) => number,
	editor: vscode.TextEditor,
	document: vscode.TextDocument,
	selection: vscode.Selection
): Thenable<boolean> {
	const { start, end }      = selection;
	const { line: startLine } = start;
	const { line: endLine }   = end;

	return editor.edit((editBuilder) => {
		for (let line = startLine; line <= endLine; ++line) {
			const textLine = document.lineAt(line);

			let selectedLineRange: vscode.Range;
			let linePrefix: string;
			let lineSuffix: string;

			if (line === startLine) {
				selectedLineRange = new vscode.Range(start, textLine.range.end);
				linePrefix = document.getText(
					new vscode.Range(textLine.range.start, start)
				);
				lineSuffix = '';
			} else if (line === endLine) {
				selectedLineRange = new vscode.Range(textLine.range.start, end);
				linePrefix = '';
				lineSuffix = document.getText(
					new vscode.Range(end, textLine.range.end)
				);
			} else {
				selectedLineRange = textLine.range;
				linePrefix = '';
				lineSuffix = '';
			}

			const lineText         = document.getText(selectedLineRange).trim();
			const paddedLineLength = computePaddedLineLength(lineText.length);

			const paddedText = lineText.padStart(
				paddedLineLength - linePrefix.length, 
				' '
			);
			const newLine = linePrefix + paddedText + lineSuffix;

			editBuilder.replace(textLine.range, newLine);
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
