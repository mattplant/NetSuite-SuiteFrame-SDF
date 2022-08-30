define(["require", "exports", "N/ui/serverWidget", "./suiteframe.library.module.js"], function (require, exports, serverWidget, suiteframe_library_module_js_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListView = void 0;
    class ListView {
        constructor(scriptUrl) {
            this.scriptUrl = scriptUrl;
        }
        generate(context) {
            let html = 'List View';
            const sql = `
				SELECT					
					'<a href="${this.scriptUrl}&employeeID=' || ID || '">Details</a>' AS Link,
					LastName || ', ' || FirstName AS Name,
					ID,
					BUILTIN.DF( Department ) AS Department,
					Title,
					BUILTIN.DF( Supervisor ) AS Supervisor,
					'<a href="tel:' || Phone || '">' || Phone || '</a>' AS Phone,
					'<a href="mailto:' || Email || '">' || Email || '</a>' AS Email			
				FROM
					Employee
				ORDER BY
					LastName,
					FirstName
			`;
            const records = suiteframe_library_module_js_1.Library.queryExecute(sql);
            if (records !== null) {
                if (typeof context.request.parameters.json !== 'undefined') {
                    html = `<pre>${JSON.stringify(records, null, 5)}</pre>`;
                }
                else {
                    const tableID = 'employeesTable';
                    const table = suiteframe_library_module_js_1.Library.recordsTableGenerate(records, tableID, true);
                    const css = suiteframe_library_module_js_1.Library.fileLoad('suiteframe.css');
                    html = suiteframe_library_module_js_1.Library.fileLoad('employee-directory.ui-list-view.template.html');
                    let searchRegExp = new RegExp('{{scriptUrl}}', 'g');
                    html = html.replace(searchRegExp, this.scriptUrl);
                    searchRegExp = new RegExp('{{appName}}', 'g');
                    html = html.replace(searchRegExp, suiteframe_library_module_js_1.Library.appName);
                    searchRegExp = new RegExp('{{appVersion}}', 'g');
                    html = html.replace(searchRegExp, suiteframe_library_module_js_1.Library.appVersion);
                    searchRegExp = new RegExp('{{appBuiltWith}}', 'g');
                    html = html.replace(searchRegExp, suiteframe_library_module_js_1.Library.appBuiltWith);
                    searchRegExp = new RegExp('{{css}}', 'g');
                    html = html.replace(searchRegExp, css);
                    searchRegExp = new RegExp('{{table}}', 'g');
                    html = html.replace(searchRegExp, table);
                    searchRegExp = new RegExp('{{tableID}}', 'g');
                    html = html.replace(searchRegExp, tableID);
                    searchRegExp = new RegExp('{{enableDatatables}}', 'g');
                    html = html.replace(searchRegExp, suiteframe_library_module_js_1.Library.enableDatatables.toString());
                    if (suiteframe_library_module_js_1.Library.hideNavBar) {
                        html = `<div style="margin: 16px;">${html}</div>`;
                    }
                }
            }
            else {
                html = 'Error: An error occurred while executing the SuiteQL query.';
            }
            const form = serverWidget.createForm({ title: suiteframe_library_module_js_1.Library.appName, hideNavBar: suiteframe_library_module_js_1.Library.hideNavBar });
            const htmlField = form.addField({ id: 'custpage_field_html', type: serverWidget.FieldType.INLINEHTML, label: 'HTML' });
            htmlField.defaultValue = html;
            context.response.writePage(form);
        }
    }
    exports.ListView = ListView;
});
