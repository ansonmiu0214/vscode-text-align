import * as vscode from 'vscode';
import * as assert from 'assert';
import * as alignments from '../../alignments';

suite('Utils Test Suite', () => {
	vscode.window.showInformationMessage('Start utils tests.');

                                  // =========
                                  // leftAlign
                                  // =========

    [
        {
            maxLineLength: 10,
            lineLength: 5,
            expectedPadding: 5,
        },
        {
            maxLineLength: 20,
            lineLength: 20,
            expectedPadding: 20,
        },
    ].forEach((scenario, i) => {
        test(`leftAlign #${i + 1}`, () => {
            // GIVEN
            const { maxLineLength, lineLength, expectedPadding } = scenario;

            // WHEN
            const actualPadding = alignments.leftAlign
                .computePadding(maxLineLength)(lineLength);

            // THEN
            assert.strictEqual(actualPadding, expectedPadding);
        });
    });

                                 // ==========
                                 // rightAlign
                                 // ==========

    [
        {
            maxLineLength: 10,
            lineLength: 5,
            expectedPadding: 10,
        },
        {
            maxLineLength: 20,
            lineLength: 20,
            expectedPadding: 20,
        },
    ].forEach((scenario, i) => {
        test(`rightAlign #${i + 1}`, () => {
            // GIVEN
            const { maxLineLength, lineLength, expectedPadding } = scenario;

            // WHEN
            const actualPadding = alignments.rightAlign
                .computePadding(maxLineLength)(lineLength);

            // THEN
            assert.strictEqual(actualPadding, expectedPadding);
        });
    });

                                 // ===========
                                 // centerAlign
                                 // ===========

    [
        {
            maxLineLength: 10,
            lineLength: 6,
            expectedPadding: 8,
        },
        {
            maxLineLength: 20,
            lineLength: 5,
            expectedPadding: 13,
        },
    ].forEach((scenario, i) => {
        test(`centerAlign #${i + 1}`, () => {
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
