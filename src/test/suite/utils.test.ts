import * as assert from 'assert';
import * as os from 'os';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as utils from '../../utils';

suite('Utils Test Suite', () => {
	vscode.window.showInformationMessage('Start utils tests.');

    test('formatPathLink - Windows', () => {
        // GIVEN
        const platform: NodeJS.Platform = 'win32';

        // WHEN
        const pathLink = utils.formatPathLink(platform, 'foo.ts', 1, 2);

        // THEN
        assert.strictEqual(pathLink, 'foo.ts#1');
    });

    test('formatPathLink - Non-Windows', () => {
        // GIVEN
        const platform: NodeJS.Platform = 'darwin';

        // WHEN
        const pathLink = utils.formatPathLink(platform, 'foo.ts', 1, 2);

        // THEN
        assert.strictEqual(pathLink, 'foo.ts:1:2');
    });
});
