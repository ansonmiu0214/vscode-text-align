import * as vscode from 'vscode';

import { expect } from 'chai';
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
            expect(pathLink).to.equal('foo.ts#1');
        });

        it('for non-Windows', () => {
            // GIVEN
            const platform: NodeJS.Platform = 'darwin';
    
            // WHEN
            const pathLink = utils.formatPathLink(platform, 'foo.ts', 1, 2);
    
            // THEN
            expect(pathLink).to.equal('foo.ts:1:2');
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
            expect(thunk).to.throw(/Maximum line length must be an integer./);
        });
    
        [
            '0',
            '-1',
        ].forEach(value => {
            it(`throws for non-positive values: '${value}'`, () => {
                // WHEN
                const thunk = () => utils.validateMaxLineLength(value);
        
                // THEN
                expect(thunk).to.throw(
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


        it('works', async () => {
            // GIVEN
            const maxLineLength = 42;
            expect(oldLineLength).to.not.equal(maxLineLength);

            // WHEN
            await utils.updateMaxLineLength(maxLineLength);
            
            // THEN
            expect(utils.getMaxLineLength()).to.equal(maxLineLength);
        });

        // TEARDOWN
        after(async () => {
            await utils.updateMaxLineLength(oldLineLength);
        });
    });
});
