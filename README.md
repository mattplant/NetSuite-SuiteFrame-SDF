# NetSuite SuiteFrame SDF Project Template

## Overview

This project template aids in building modern NetSuite-native solutions by leveraging the [SuiteFrame](https://timdietrich.me/blog/netsuite-suiteframe/) framework with the [NetSuite TypeScript SDF](https://github.com/mattplant/NetSuite-SuiteFrame-SDF) project template.

## Getting Started

High level steps to get started with this project template:

1. Clone this repository
2. Run `npm install` to install the project dependencies
3. Deploy SDF Project to NetSuite
4. Click on the "URL" link from the deployed SuiteFrame Suitelet deployment record to open the SuiteFrame application in a new browser tab

See the [NetSuite TypeScript SDF project template](https://github.com/mattplant/NetSuite-TypeScript-SDF) for more detailed information.

## Customization

No customization is needed to use this project template.

Timothy Dietrich's Employee example functionality is included with the exception of the JavaScript files being generated from Typescript.

### Multiple SuiteFrame Projects

If you want to run multiple SuiteFrame applications in the same NetSuite account, then each needs to be in its own folder with unique ids.

- update the **FileCabinet deployment folder** which is at /src/FileCabinet/SuiteScript/
- update the **Suitelet object's** (/src/Objects/customscript_idev_sl_sf_emp_core.xml) file:
  - both the script and deployment "scriptid"s
  - the "scriptfile" path to match your new FileCabinet deployment folder
- update the **/tsconfig.json** "outDir" value to match your new FileCabinet deployment folder
- update the **/package.json** for your project including "name", "description", and "version"
- update the **SuiteFrame configs** ("appName" and "appVersion") which are currently constants in the /src/FileCabinet/SuiteScript/idev_sf_emp_core.ts file

## Acknowledgments

- Timothy Dietrich for the [SuiteFrame framework](https://timdietrich.me/blog/netsuite-suiteframe/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
