import { expect } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import { createSandbox, mock } from 'sinon';
import Sinon = require('sinon');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as textAlignExtension from '../../extension';
import * as alignments from '../../alignments';
import * as utils from '../../utils';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	let sandbox: Sinon.SinonSandbox;
	let alignment: any;
	let outputChannel: any;
	let platform: NodeJS.Platform;
	let editor: any;

	describe('No editor is active', () => {
		it('works', async () => {
			// GIVEN
			editor = undefined;

			// WHEN/THEN
			await textAlignExtension.alignmentCommand(
				alignment,
				outputChannel,
				platform,
				editor,
			);
		});
	});

	describe('Active editor but no selection', () => {
		beforeEach(() => {
			sandbox = createSandbox();
		});

		it('notifies user', async () => {
			// GIVEN
			const showErrorMessage = sandbox.stub(vscode.window, 'showErrorMessage');
			const editor = {
				selections: [
					{
						isEmpty: true,
					}
				]
			} as unknown as vscode.TextEditor;

			// WHEN
			await textAlignExtension.alignmentCommand(
				alignment,
				outputChannel,
				platform,
				editor,
			);

			// THEN
			expect(showErrorMessage.calledWith('No selections to align.'))
				.to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe('Active editor with selections', () => {
		let getMaximumLineLength: Sinon.SinonStub;
		let showErrorMessage: Sinon.SinonStub;
		let formatPathLink: Sinon.SinonStub;
		let alignText: Sinon.SinonStub;

		beforeEach(() => {
			sandbox = createSandbox();
			getMaximumLineLength = sandbox.stub(utils, 'getMaxLineLength');
			showErrorMessage = sandbox.stub(vscode.window, 'showErrorMessage');
			formatPathLink = sandbox.stub(utils, 'formatPathLink');
			alignText = sandbox.stub(alignments, 'alignText');
		});

		it('shows error message and outputs lines that fail', async () => {
			// GIVEN
			alignment = {
				computePadding: sandbox.stub().returns(() => {}),
			};

			alignText.returns(Promise.resolve(false));
		
			editor = {
				selections: [
					{
						isEmpty: false,
						start: {
							line: 0,
							character: 0,
						},
					},
				],
				document: {
					uri: {
						fsPath: 'some path'
					}
				}
			} as unknown as vscode.TextEditor;

			getMaximumLineLength.returns(79);
			formatPathLink.returns('some position');

			outputChannel = {
				appendLine: () => {},
				show: () => {},
			};

			const mockOutputChannel = mock(outputChannel);
			mockOutputChannel
				.expects('appendLine')
				.once();

			mockOutputChannel
				.expects('show')
				.once();

			// WHEN
			await textAlignExtension.alignmentCommand(
				alignment,
				outputChannel,
				platform,
				editor,
			);

			// THEN
			expect(alignText.calledOnce).to.be.true;
			expect(formatPathLink.calledOnce).to.be.true;
			expect(showErrorMessage.calledOnce).to.be.true;
			mockOutputChannel.verify();
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
