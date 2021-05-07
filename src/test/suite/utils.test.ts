import * as vscode from 'vscode';
import * as assert from 'assert';
import * as utils from '../../utils';

suite('Utils Test Suite', () => {
	vscode.window.showInformationMessage('Start utils tests.');

                               // ==============
                               // formatPathLink
                               // ==============

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

                            // =====================
                            // validateMaxLineLength
                            // =====================

    [
        '1',
        ' 12',
        ' 99 ',
    ].forEach(value => {
        test(`validateMaxLineLength - valid: '${value}'`, () => {
            // WHEN/THEN
            utils.validateMaxLineLength(value);
        });
    });

    test('validateMaxLineLength - non-integer', () => {
        // GIVEN
        const value = 'abc';

        // WHEN
        const thunk = () => utils.validateMaxLineLength(value);

        // THEN
        assert.throws(thunk, /Maximum line length must be an integer./);
    });

    [
        '0',
        '-1',
    ].forEach(value => {
        test(`validateMaxLineLength - non-positive: '${value}'`, () => {
            // WHEN
            const thunk = () => utils.validateMaxLineLength(value);
    
            // THEN
            assert.throws(
                thunk,
                /Maximum line length must be a positive integer./
            );
        });
    });

                             // ===================
                             // updateMaxLineLength
                             // ===================

    test('updateMaxLineLength', async () => {
        // SETUP
        const oldLineLength = utils.getMaxLineLength();

        try {
            // GIVEN
            const maxLineLength = 42;
            assert.notStrictEqual(oldLineLength, maxLineLength);
    
            // WHEN
            await utils.updateMaxLineLength(maxLineLength);
    
            // THEN
            assert.strictEqual(utils.getMaxLineLength(), maxLineLength);

        } finally {
            // TEARDOWN
            await utils.updateMaxLineLength(oldLineLength);
        }
    });
});
