import record = require('N/record');
import serverWidget = require('N/ui/serverWidget')
import url = require('N/url');
import { Library } from './suiteframe.library.module.js';

export class DetailView {
  constructor(
			private scriptUrl: string
  ) {
  }

  public generate(context) {
    let html = 'Detail View';
    const { employeeID } = context.request.parameters;

    const employee = this.employeeGet(employeeID);
    if (employee == null) {
      context.response.write('Error: An error occurred while executing the SuiteQL query.');
      return;
    }

    employee.imageURL = this.employeeImageUrlGet(employeeID);
    employee.logins = this.employeeLoginsGet(employeeID);
    const css = Library.fileLoad('suiteframe.css');
    html = Library.fileLoad('employee-directory.ui-detail-view.template.html');

    let searchRegExp = new RegExp('{{scriptUrl}}', 'g');
    html = html.replace(searchRegExp, this.scriptUrl);

    searchRegExp = new RegExp('{{appName}}', 'g');
    html = html.replace(searchRegExp, Library.appName);

    searchRegExp = new RegExp('{{appVersion}}', 'g');
    html = html.replace(searchRegExp, Library.appVersion);

    searchRegExp = new RegExp('{{appBuiltWith}}', 'g');
    html = html.replace(searchRegExp, Library.appBuiltWith);

    searchRegExp = new RegExp('{{css}}', 'g');
    html = html.replace(searchRegExp, css);

    searchRegExp = new RegExp('{{employeeJSON}}', 'g');
    html = html.replace(searchRegExp, JSON.stringify(employee, null, 5));

    if (Library.hideNavBar) {
      html = `<div style="margin: 16px;">${html}</div>`;
    }

    if (typeof context.request.parameters.json !== 'undefined') {
      html = `<pre>${JSON.stringify(employee, null, 5)}</pre>`;
      Library.hideNavBar = true;
    }

    if (Library.hideNavBar) {
      context.response.write(html);
    } else {
      const form = serverWidget.createForm({ title: 'Employee Details', hideNavBar: Library.hideNavBar });
      const htmlField = form.addField({ id: 'custpage_field_html', type: serverWidget.FieldType.INLINEHTML, label: 'HTML' });
      htmlField.defaultValue = html;
      context.response.writePage(form);
    }
  }

  private employeeGet(employeeID) {
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

    const records = Library.queryExecute(sql);

    if (records !== null) {
      return records[0];
    }
    return null;
  }

  private employeeImageUrlGet(employeeID) {
    const employeeRecord = record.load({ type: 'employee', id: employeeID, isDynamic: false });
    const employee = JSON.parse(JSON.stringify(employeeRecord));
    const imageFileID = employee.fields.image;
    let imageURL = '';

    if (imageFileID == null) {
      return imageURL;
    }

    const sql = `SELECT URL FROM File WHERE ID = ${imageFileID}`;
    const files = Library.queryExecute(sql);
    if ((files.length !== null) && (files.length === 1)) {
      const imageFile = files[0];
      const appURL = url.resolveDomain({ hostType: url.HostType.APPLICATION });
      imageURL = `https://${appURL}${imageFile.url}`;
    }

    return imageURL;
  }

  private employeeLoginsGet(employeeID) {
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
    const logins = Library.queryExecute(sql);

    return logins;
  }
}
