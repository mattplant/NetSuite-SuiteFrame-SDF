define(["require", "exports", "N/file", "N/log", "N/query"], function (require, exports, file, log, query) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Library = void 0;
    class Library {
        static fileLoad(fileName) {
            const queryResults = query.runSuiteQL({ query: `SELECT ID FROM File WHERE Name = '${fileName}'` }).asMappedResults();
            if (queryResults.length === 0) {
                return '';
            }
            const fileID = queryResults[0].id;
            const fileObj = file.load({ id: fileID });
            const contents = fileObj.getContents();
            return contents;
        }
        static recordsTableGenerate(records, tableID, excludeRowNumber) {
            if ((records === null) || (records.length == 0)) {
                return '';
            }
            const columnNames = Object.keys(records[0]);
            let thead = '<thead class="thead-light">';
            thead += '<tr>';
            for (let i = 0; i < columnNames.length; i++) {
                if ((excludeRowNumber) && (columnNames[i] == 'rownumber')) {
                    continue;
                }
                thead += `<th>${columnNames[i]}</th>`;
            }
            thead += '</tr>';
            thead += '</thead>';
            let tbody = '<tbody>';
            for (let r = 0; r < records.length; r++) {
                tbody += '<tr>';
                for (let i = 0; i < columnNames.length; i++) {
                    if ((excludeRowNumber) && (columnNames[i] == 'rownumber')) {
                        continue;
                    }
                    let value = records[r][columnNames[i]];
                    if (value === null) {
                        value = '';
                    }
                    tbody += `<td>${value}</td>`;
                }
                tbody += '</tr>';
            }
            tbody += '</tbody>';
            const html = `
				<table id="${tableID}" class="styled-table">
					${thead}
					${tbody}
				</table>
			`;
            return html;
        }
        static queryExecute(sql) {
            let records = [];
            try {
                let moreRecords = true;
                let paginatedRowBegin = 1;
                const paginatedRowEnd = 5000;
                const nestedSQL = sql;
                const queryParams = [];
                do {
                    const paginatedSQL = `SELECT * FROM ( SELECT ROWNUM AS ROWNUMBER, * FROM (${nestedSQL} ) ) WHERE ( ROWNUMBER BETWEEN ${paginatedRowBegin} AND ${paginatedRowEnd})`;
                    const queryResults = query.runSuiteQL({ query: paginatedSQL, params: queryParams }).asMappedResults();
                    records = records.concat(queryResults);
                    if (queryResults.length < 5000) {
                        moreRecords = false;
                    }
                    paginatedRowBegin += 5000;
                } while (moreRecords);
            }
            catch (e) {
                log.error({ title: 'queryExecute - Error', details: e });
                records = null;
            }
            return records;
        }
    }
    exports.Library = Library;
    Library.appName = 'NetSuite SuiteFrame SDF Project Template';
    Library.appVersion = '0.7.2';
    Library.appBuiltWith = 'Built with <a href="https://timdietrich.me/blog/netsuite-suiteframe/" target="_tim">SuiteFrame</a> in <a href="https://github.com/mattplant/netsuite-typescript-sdf/" target="_blank">NetSuite TypeScript SDF Project Template</a>.';
    Library.hideNavBar = false;
    Library.enableDatatables = true;
});
