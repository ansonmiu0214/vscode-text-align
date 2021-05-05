import * as vscode from "vscode";

import Config from "./config";

export {
    formatPathLink,
    getMaxLineLength,
    updateMaxLineLength,
    validateMaxLineLength,
};

function formatPathLink(
    platform: NodeJS.Platform,
    filePath: string,
    line: number,
    character: number
): string {
	switch (platform) {
		case 'win32':
			return [filePath, line].join('#');
		default:
			return [filePath, line, character].join(':');
	}
}

function getConfig(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(Config.EXTENSION_NAME);
}

function getMaxLineLength(): number {
	return getConfig().get<number>(Config.MAX_LINE_LENGTH_CONFIG_SECTION)
        ?? Config.DEFAULT_MAX_LINE_LENGTH;
}

async function updateMaxLineLength(maxLineLength: number): Promise<void> {
    await getConfig().update(
        Config.MAX_LINE_LENGTH_CONFIG_SECTION,
        maxLineLength,
        vscode.ConfigurationTarget.Global
    );
}

/**
 * Validates whether the specified 'value' is a valid line length. Returns void
 * on valid input, throws an error on invalid input.
 * 
 * @param {string} value - Maximum line length to validate.
 * 
 * @throws Will throw an error if 'value' is not a non-negative integer.
 */
function validateMaxLineLength(value: string): void {
    const maxLineLength = Number.parseInt(value);
    if (Number.isNaN(maxLineLength)) {
        throw new Error('Maximum line length must be an integer.');
    }

    if (maxLineLength <= 0) {
        throw new Error(
            'Maximum line length must be a non-negative integer.'
        );
    }
}