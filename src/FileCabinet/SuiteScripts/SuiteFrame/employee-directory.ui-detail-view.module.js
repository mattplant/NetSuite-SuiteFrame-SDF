define(["require", "exports", "N/record", "N/ui/serverWidget", "N/url", "./suiteframe.library.module.js"], function (require, exports, record, serverWidget, url, suiteframe_library_module_js_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DetailView = void 0;
    class DetailView {
        constructor(scriptUrl) {
            this.scriptUrl = scriptUrl;
        }
        generate(context) {
            let html = 'Detail View';
            const { employeeID } = context.request.parameters;
            const employee = this.employeeGet(employeeID);
            if (employee == null) {
                context.response.write('Error: An error occurred while executing the SuiteQL query.');
                return;
            }
            employee.imageURL = this.employeeImageUrlGet(employeeID);
            employee.logins = this.employeeLoginsGet(employeeID);
            const css = suiteframe_library_module_js_1.Library.fileLoad('suiteframe.css');
            html = suiteframe_library_module_js_1.Library.fileLoad('employee-directory.ui-detail-view.template.html');
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
            searchRegExp = new RegExp('{{employeeJSON}}', 'g');
            html = html.replace(searchRegExp, JSON.stringify(employee, null, 5));
            if (suiteframe_library_module_js_1.Library.hideNavBar) {
                html = `<div style="margin: 16px;">${html}</div>`;
            }
            if (typeof context.request.parameters.json !== 'undefined') {
                html = `<pre>${JSON.stringify(employee, null, 5)}</pre>`;
                suiteframe_library_module_js_1.Library.hideNavBar = true;
            }
            if (suiteframe_library_module_js_1.Library.hideNavBar) {
                context.response.write(html);
            }
            else {
                const form = serverWidget.createForm({ title: 'Employee Details', hideNavBar: suiteframe_library_module_js_1.Library.hideNavBar });
                const htmlField = form.addField({
                    id: 'custpage_field_html',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'HTML',
                });
                htmlField.defaultValue = html;
                context.response.writePage(form);
            }
        }
        employeeGet(employeeID) {
            const sql = `
				SELECT
					ID,
					EntityID,
					FirstName,
					LastName,
					COALESCE( BUILTIN.DF( Department ), 'Unknown' ) AS Department,
					COALESCE( Title, 'Unknown' ) AS Title,
					Supervisor AS SupervisorID,
					COALESCE( BUILTIN.DF( Supervisor ), 'None' ) AS SupervisorName,
					Phone,
					MobilePhone,
					OfficePhone,
					Email,
					HireDate,
					BUILTIN.DF( Subsidiary ) AS Subsidiary,
					Comments,
					IsInactive
				FROM
					Employee
				WHERE
					Employee.ID = ${employeeID}
			`;
            const records = suiteframe_library_module_js_1.Library.queryExecute(sql);
            if (records !== null) {
                return records[0];
            }
            return null;
        }
        employeeImageUrlGet(employeeID) {
            const employeeRecord = record.load({ type: 'employee', id: employeeID, isDynamic: false });
            const employee = JSON.parse(JSON.stringify(employeeRecord));
            const imageFileID = employee.fields.image;
            let imageURL = '';
            if (imageFileID == null) {
                return imageURL;
            }
            const sql = `SELECT URL FROM File WHERE ID = ${imageFileID}`;
            const files = suiteframe_library_module_js_1.Library.queryExecute(sql);
            if (files.length !== null && files.length === 1) {
                const imageFile = files[0];
                const appURL = url.resolveDomain({ hostType: url.HostType.APPLICATION });
                imageURL = `https://${appURL}${imageFile.url}`;
            }
            return imageURL;
        }
        employeeLoginsGet(employeeID) {
            const sql = `
				SELECT TOP 5
					TO_CHAR( LoginAudit.Date, 'YYYY-MM-DD hh:mi:ss') AS DateTime,
					LoginAudit.Status,
					BUILTIN.DF( LoginAudit.Role ) AS RoleUsed
				FROM
					LoginAudit
				WHERE
					( LoginAudit.User = ${employeeID} )
				ORDER BY
					LoginAudit.Date DESC
			`;
            const logins = suiteframe_library_module_js_1.Library.queryExecute(sql);
            return logins;
        }
    }
    exports.DetailView = DetailView;
});
