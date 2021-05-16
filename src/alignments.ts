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

/**
 * Performs the text alignment for the specified 'selection' found on the
 * specified 'document' in the specified 'editor'. Uses the specified function
 * 'computePaddedLineLength' to construct a modified string to replace the
 * current 'selection'.
 *
 * @async
 * @param computePaddedLineLength - A function that computes the required
 * whitespace padding to perform the required alignment, given the current
 * line's length.
 * @param editor - The current editor to perform the alignment on.
 * @param document - The document in the current editor to perform the
 * alignment on.
 * @param selection - The current selection to perform the alignment on.
 * @returns {Thenable<boolean>} - A promise that resolves to true iff the
 * alignment can be applied on the document.
 */
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
