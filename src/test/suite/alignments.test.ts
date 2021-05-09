import * as vscode from 'vscode';
import * as assert from 'assert';
import { describe, it } from 'mocha';

import * as alignments from '../../alignments';

suite('Utils Test Suite', () => {
	vscode.window.showInformationMessage('Start utils tests.');

                                  // =========
                                  // leftAlign
                                  // =========

    describe('leftAlign', () => {
        [
            {
                maxLineLength: 10,
                lineLength: 5,
                expectedPadding: 5,
                description: 'line length shorter than max line length'
            },
            {
                maxLineLength: 20,
                lineLength: 20,
                expectedPadding: 20,
                description: 'line length same as max line length'
            },
        ].forEach(({ description, ...scenario }) => {
            it(description, () => {
                // GIVEN
                const { maxLineLength, lineLength, expectedPadding } = scenario;
    
                // WHEN
                const actualPadding = alignments.leftAlign
                    .computePadding(maxLineLength)(lineLength);
    
                // THEN
                assert.strictEqual(actualPadding, expectedPadding);
            });
        });
    });

                                 // ==========
                                 // rightAlign
                                 // ==========

    describe('rightAlign', () => {
        [
            {
                maxLineLength: 10,
                lineLength: 5,
                expectedPadding: 10,
                description: 'line length shorter than max line length'
            },
            {
                maxLineLength: 20,
                lineLength: 20,
                expectedPadding: 20,
                description: 'line length same as max line length'
            },
        ].forEach(({ description, ...scenario}) => {
            it(description, () => {
                // GIVEN
                const { maxLineLength, lineLength, expectedPadding } = scenario;
    
                // WHEN
                const actualPadding = alignments.rightAlign
                    .computePadding(maxLineLength)(lineLength);
    
                // THEN
                assert.strictEqual(actualPadding, expectedPadding);
            });
        });
    });

                                 // ===========
                                 // centerAlign
                                 // ===========

    describe('centerAlign', () => {
        [
            {
                maxLineLength: 10,
                lineLength: 6,
                expectedPadding: 8,
                description: 'line length and max line length same parity'
            },
            {
                maxLineLength: 20,
                lineLength: 5,
                expectedPadding: 13,
                description: 'line length and max line length different parity'
            },
        ].forEach(({ description, ...scenario }) => {
            it(description, () => {
                // GIVEN
                const { maxLineLength, lineLength, expectedPadding } = scenario;
    
                // WHEN
                const actualPadding = alignments.centerAlign
                    .computePadding(maxLineLength)(lineLength);
    
                // THEN
                assert.strictEqual(actualPadding, expectedPadding);
            });
        });
    });
});
