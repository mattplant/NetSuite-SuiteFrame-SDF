import serverWidget = require('N/ui/serverWidget')
import { Library } from './suiteframe.library.module.js';

export class ListView {
  constructor(
			private scriptUrl: string
  ) {
  }

  public generate(context) {
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
    const records = Library.queryExecute(sql);

    if (records !== null) {
      if (typeof context.request.parameters.json !== 'undefined') {
        html = `<pre>${JSON.stringify(records, null, 5)}</pre>`;
      } else {
        const tableID = 'employeesTable';
        const table = Library.recordsTableGenerate(records, tableID, true);
        const css = Library.fileLoad('suiteframe.css');

        html = Library.fileLoad('employee-directory.ui-list-view.template.html');

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

        searchRegExp = new RegExp('{{table}}', 'g');
        html = html.replace(searchRegExp, table);

        searchRegExp = new RegExp('{{tableID}}', 'g');
        html = html.replace(searchRegExp, tableID);

        searchRegExp = new RegExp('{{enableDatatables}}', 'g');
        html = html.replace(searchRegExp, Library.enableDatatables.toString());

        if (Library.hideNavBar) {
          html = `<div style="margin: 16px;">${html}</div>`;
        }
      }
    } else {
      html = 'Error: An error occurred while executing the SuiteQL query.';
    }

    const form = serverWidget.createForm({ title: Library.appName, hideNavBar: Library.hideNavBar });
    const htmlField = form.addField({ id: 'custpage_field_html', type: serverWidget.FieldType.INLINEHTML, label: 'HTML' });
    htmlField.defaultValue = html;
    context.response.writePage(form);
  }
}
