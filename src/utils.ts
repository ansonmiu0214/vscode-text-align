import * as vscode from "vscode";

import Config from "./config";

export {
    formatPathLink,
    getMaxLineLength,
    updateMaxLineLength,
    validateMaxLineLength,
};

/**
 * Returns a string that can be interpreted by the given 'platform' as a
 * hyperlink that references the given 'filePath', 'line' and 'character'.
 *
 * @param {NodeJS.Platform} platform - The current operating system.
 * @param {string} filePath
 * @param {number} line 
 * @param {number} character 
 * @returns {string} 
 */
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

/**
 * Fetches the user's VS Code config file for this extension.
 *
 * @returns {vscode.WorkspaceConfiguration} The user's VS Code config file for
 * this extension.
 */
function getConfig(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(Config.EXTENSION_NAME);
}

/**
 * Fetches the maximum line length defined in the user's VS Code config file.
 * 
 * @returns {number} Maximum line length defined by user in VS Code config
 * file, or the default value defined in `config.ts`.
 */
function getMaxLineLength(): number {
	return getConfig().get<number>(Config.MAX_LINE_LENGTH_CONFIG_SECTION)
        ?? Config.DEFAULT_MAX_LINE_LENGTH;
}

/**
 * Updates the maximum line length setting in the user's config with the new
 * 'maxLineLength'.
 *
 * @async
 * @param {number} maxLineLength  - New value for maximum line length
 */
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
 * @throws Will throw an error if 'value' is not a non-negative integer.
 */
function validateMaxLineLength(value: string): void {
    const maxLineLength = Number.parseInt(value);
    if (Number.isNaN(maxLineLength)) {
        throw new Error('Maximum line length must be an integer.');
    }

    if (maxLineLength <= 0) {
        throw new Error(
            'Maximum line length must be a positive integer.'
        );
    }
}