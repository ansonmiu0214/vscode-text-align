import * as vscode from 'vscode';
import * as assert from 'assert';
import { after, before, describe, it } from 'mocha';

import * as utils from '../../utils';

suite('Utils Test Suite', () => {
	vscode.window.showInformationMessage('Start utils tests.');

                               // ==============
                               // formatPathLink
                               // ==============

    describe('formatPathLink', () => {
        it('for Windows', () => {
            // GIVEN
            const platform: NodeJS.Platform = 'win32';
    
            // WHEN
            const pathLink = utils.formatPathLink(platform, 'foo.ts', 1, 2);
    
            // THEN
            assert.strictEqual(pathLink, 'foo.ts#1');
        });

        it('for non-Windows', () => {
            // GIVEN
            const platform: NodeJS.Platform = 'darwin';
    
            // WHEN
            const pathLink = utils.formatPathLink(platform, 'foo.ts', 1, 2);
    
            // THEN
            assert.strictEqual(pathLink, 'foo.ts:1:2');
        });
    });

                            // =====================
                            // validateMaxLineLength
                            // =====================

    describe('validateMaxLineLength', () => {
        [
            '1',
            ' 12',
            ' 99 ',
        ].forEach(value => {
            it(`works for valid input: '${value}'`, () => {
                // WHEN/THEN
                utils.validateMaxLineLength(value);
            });
        });
    
        it('throws for non-integers', () => {
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
            it(`throws for non-positive values: '${value}'`, () => {
                // WHEN
                const thunk = () => utils.validateMaxLineLength(value);
        
                // THEN
                assert.throws(
                    thunk,
                    /Maximum line length must be a positive integer./
                );
            });
        });
    });

                             // ===================
                             // updateMaxLineLength
                             // ===================

    describe('updateMaxLineLength', () => {
        let oldLineLength: number;
    
        // SETUP
        before(() => {
            oldLineLength = utils.getMaxLineLength();
        });


        it('works', (done) => {
            // GIVEN
            const maxLineLength = 42;
            assert.notStrictEqual(oldLineLength, maxLineLength);

            // WHEN
            utils.updateMaxLineLength(maxLineLength).then(() => {
                // THEN
                assert.strictEqual(utils.getMaxLineLength(), maxLineLength);
                done();
            }).catch(done);
        });

        // TEARDOWN
        after((done) => {
            utils.updateMaxLineLength(oldLineLength)
                .then(done)
                .catch(done);
        });
    });
});
