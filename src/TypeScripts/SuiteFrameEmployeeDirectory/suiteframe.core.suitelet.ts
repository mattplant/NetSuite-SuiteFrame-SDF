/**
 * SuiteFrame Core Script
 *
 * This is the core SuiteFrame script that "initializes the app, routes requests, delivers views,
 * and processes API requests".
 *
 * @NScriptName SuiteFrame Core Script
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

/*
 *------------------------------------------------------------------------------------------
 * MIT License
 *------------------------------------------------------------------------------------------
 *
 * Copyright (c) 2022 Timothy Dietrich.
 * Copyright (c) 2022 Matthew Plant.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *------------------------------------------------------------------------------------------
 * Developer(s)
 *------------------------------------------------------------------------------------------
 *
 * Tim Dietrich
 * • timdietrich@me.com
 * • https://timdietrich.me
 *
 * Matt Plant
 * • i@idev.systems
 * • https://idev.systems/
 *
 *------------------------------------------------------------------------------------------
 * History
 *------------------------------------------------------------------------------------------
 *
 * 20220601 - Tim Dietrich
 * • Initial version.
 *
 * 20220602 - Tim Dietrich
 * • Added support for "&json=T" URL param. Displays list view's recordset as a JSON string, and detail view's employee record. Added support for "enableDatatables" app-level setting.
 *
 * 20220612 - Tim Dietrich
 * • Initial public release.
 *
 * 20220826 - Matt Plant
 * • Initial SuiteFrame TypeScript SDF Project Template version.
 */

import { EntryPoints } from 'N/types';
import error = require('N/error');
import log = require('N/log');
import record = require('N/record');
import runtime = require('N/runtime');
import url = require('N/url');

import { DetailView } from './employee-directory.ui-detail-view.module';
import { ListView } from './employee-directory.ui-list-view.module';

const scriptUrl = url.resolveScript({ scriptId: runtime.getCurrentScript().id, deploymentId: runtime.getCurrentScript().deploymentId, returnExternalUrl: false });

export function onRequest(context: EntryPoints.Suitelet.onRequestContext) {
	try {
		if (context.request.method === 'GET') {
			getRequestHandle(context);
		} else { // form submitted
			postRequestHandle(context);
		}
	} catch (e) {
		throw error.create({
			name: e.name,
			message: e.message,
			notifyOff: true 
		});
	}
}

function getRequestHandle(context) {
	if (typeof context.request.parameters.employeeID === 'undefined') {
		const listView = new ListView(scriptUrl);
		listView.generate(context);
	} else {
		const detailView = new DetailView(scriptUrl);
		detailView.generate(context);
	}
}

function postRequestHandle(context) {
	log.debug({
		title: 'postRequestHandle - context',
		details: context 
	});

	const requestPayload = context.request.body;
	context.response.setHeader('Content-Type', 'application/json');

	if ((typeof requestPayload.function === 'undefined') || (requestPayload.function === null)) {
		context.response.write(JSON.stringify({
			error: 'No function was specified.' 
		}));
		return;
	}

	switch (requestPayload.function) {
	case 'employeeNotesUpdate':
		employeeNotesUpdate(context);
		break;

	default:
		context.response.write(JSON.stringify({
			error: 'An unsupported function was specified.' 
		}));
	}
}

function employeeNotesUpdate(context) {
	let requestPayload: any;
	let responsePayload: any;

	try {
		requestPayload = JSON.parse(context.request.body);
		record.submitFields({
			type: record.Type.EMPLOYEE,
			id: requestPayload.employeeID,
			values: {
				comments: requestPayload.comments
			},
			options: {
				enableSourcing: false,
				ignoreMandatoryFields: true
			}
		});
		responsePayload = {
			status: 'success' 
		};
		log.debug('employeeNotesUpdate - responsePayload', responsePayload);
		context.response.write(JSON.stringify(responsePayload, null, 5));
	} catch (e) {
		log.error('Update Error', {
			requestPayload,
			error: e 
		});
		responsePayload = {
			status: 'error' 
		};
	}
}
