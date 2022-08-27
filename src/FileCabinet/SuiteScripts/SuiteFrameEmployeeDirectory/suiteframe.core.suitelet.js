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
define(["require", "exports", "N/error", "N/log", "N/record", "N/runtime", "N/url", "./employee-directory.ui-detail-view.module", "./employee-directory.ui-list-view.module"], function (require, exports, error, log, record, runtime, url, employee_directory_ui_detail_view_module_1, employee_directory_ui_list_view_module_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    const scriptUrl = url.resolveScript({ scriptId: runtime.getCurrentScript().id, deploymentId: runtime.getCurrentScript().deploymentId, returnExternalUrl: false });
    function onRequest(context) {
        try {
            if (context.request.method === 'GET') {
                getRequestHandle(context);
            }
            else { // form submitted
                postRequestHandle(context);
            }
        }
        catch (e) {
            throw error.create({
                name: e.name,
                message: e.message,
                notifyOff: true
            });
        }
    }
    exports.onRequest = onRequest;
    function getRequestHandle(context) {
        if (typeof context.request.parameters.employeeID === 'undefined') {
            const listView = new employee_directory_ui_list_view_module_1.ListView(scriptUrl);
            listView.generate(context);
        }
        else {
            const detailView = new employee_directory_ui_detail_view_module_1.DetailView(scriptUrl);
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
        let requestPayload;
        let responsePayload;
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
        }
        catch (e) {
            log.error('Update Error', {
                requestPayload,
                error: e
            });
            responsePayload = {
                status: 'error'
            };
        }
    }
});
