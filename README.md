# NetSuite SuiteFrame SDF Project Template

## Overview
A **NetSuite TypeScript SDF** project template leveraging Timothy Dietrich's **SuiteFrame** framework.
- For information on the **NetSuite TypeScript SDF project template**, see https://github.com/mattplant/NetSuite-TypeScript-SDF.
- For information on the **SuiteFrame** framework, see https://timdietrich.me/blog/netsuite-suiteframe/.

## Getting Started

High level steps to get started with this project template
1. Clone this repository
2. Run `npm install` to install the project dependencies
3. Deploy SDF Project to NetSuite
4. Click on the "URL" link from the deployed SuiteFrame Suitelet deployment record to open the SuiteFrame application in a new browser tab

See the [NetSuite TypeScript SDF project template](https://github.com/mattplant/NetSuite-TypeScript-SDF) for more detailed information.

## Customization
No customization is needed to use this project template.  

Timothy Dietrich's Employee example functionality is included with the exception of the JavaScript files being generated from Typescript.

### Multiple SuiteFrame Projects

To prevent conflicts, the following customization is required:
- update the **FileCabinet deployment folder** which is at /src/FileCabinet/SuiteScript/
- update the **Suitelet object's** (/src/Objects/customscript_idev_sl_sf_emp_core.xml) file:
  - both the script and deployment "scriptid"s
  - the "scriptfile" path to match you new FileCabinet deployment folder
- update the **/tsconfig.json** "outDir" value to match your new FileCabinet deployment folder
- update the **/package.json** for your project including "name", "description", and "version"
- update the **SuiteFrame configs** ("appName" and "appVersion") which are currently constants in the /src/FileCabinet/SuiteScript/idev_sf_emp_core.ts file

**Customization is required to install multiple SuiteFrame projects in the same NetSuite account.**

## Acknowledgments
- Timothy Dietrich for the [SuiteFrame framework](https://timdietrich.me/blog/netsuite-suiteframe/)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
