import * as vscode from 'vscode';

export interface Alignment {
    name: string;
    computePadding: (maxLineLength: number) => (lineLength: number) => number;
};

export const leftAlign: Alignment = {
    name: 'alignLeft',
    computePadding: (maxLineLength) => (lineLength) => lineLength,
};

export const centerAlign: Alignment = {
    name: 'alignCenter',
    computePadding: (maxLineLength) => (lineLength) => (
		Math.ceil((maxLineLength - lineLength) / 2) + lineLength
    ),
};

export const rightAlign: Alignment = {
    name: 'alignRight',
    computePadding: (maxLineLength) => (lineLength) => maxLineLength,
};

export function alignText(
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
