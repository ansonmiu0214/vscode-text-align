// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { platform } from "os";

import {
	Alignment,
	alignText,
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

export {
	activate,
	alignmentCommand,
	deactivate,
};

interface Command {
	name: string;
	callback: (...args: any[]) => any;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context: vscode.ExtensionContext) {	
	console.log('Congratulations, your extension "text-align" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	const outputChannel = vscode.window.createOutputChannel('Text Align');

	const alignmentCommands = [leftAlign, centerAlign, rightAlign]
		.map(alignment => {
			const { name, callback } = buildAlignmentCommand(
				alignment,
				outputChannel
			);
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

/**
 * Returns an object that holds the name and the callback for a VS Code
 * command that performs the specified 'alignment'.
 *
 * @param alignment - The alignment that the command will perform.
 * @param outputChannel - The output channel that the command will use.
 * @returns {Command} - The name of the command and its callback.
 */
function buildAlignmentCommand(
	alignment: Alignment,
	outputChannel: vscode.OutputChannel
): Command {
	return {
		name: alignment.name,
		callback: async () => {
			await alignmentCommand(
				alignment,
				outputChannel,
				platform(),
				vscode.window.activeTextEditor
			);
		},
	};
}

/**
 * The callback for a VS Code command to perform the specified 'alignment' on
 * an instance of the VS Code text 'editor', given the user's 'platform'. The
 * callback is a no-op if an editor is not defined, or if there are no active
 * text selections in the 'editor'. If there are alignments that cannot be
 * applied on the document, the user will be notified via the 'outputChannel'.
 *
 * @async
 * @param {Alignment} alignment - The alignment that the command will perform.
 * @param {vscode.OutputChannel} outputChannel - The output channel that the
 * command will use.
 * @param {NodeJS.Platform} platform - The current operating system.
 * @param {vscode.TextEditor | undefined} editor - The active text editor.
 * @returns 
 */
async function alignmentCommand(
	alignment: Alignment,
	outputChannel: vscode.OutputChannel,
	platform: NodeJS.Platform,
	editor?: vscode.TextEditor,
): Promise<void> {
	if (!editor) {
		return;
	}

	const nonEmptySelections = editor.selections
		.filter(selection => !selection.isEmpty);

	if (nonEmptySelections.length === 0) {
		vscode.window.showErrorMessage('No selections to align.');
		return;
	}

	const maxLineLength = getMaxLineLength();

	let allEditsCanBeApplied = true;
	for (const selection of nonEmptySelections) {
		const replacement = alignText(
			alignment.computePadding(maxLineLength),
			editor,
			editor.document,
			selection
		);

		const editCanBeApplied = await replacement;
		allEditsCanBeApplied &&= editCanBeApplied;
		
		if (!editCanBeApplied) {
			const filePosition = formatPathLink(
				platform,
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
}

/**
 * Prompts the user to configure the maximum line length for this extension via
 * a VS Code input box.
 *
 * @async
 */
async function promptUserToConfigureMaxLineLength(): Promise<void> {
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


// this method is called when your extension is deactivated
function deactivate() {}
