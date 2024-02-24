"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
const file_1 = require("./file");
const employees_1 = require("./employees");
const file_grpc_server_1 = require("./file.grpc-server");
const employees_grpc_server_1 = require("./employees.grpc-server");
const runtime_1 = require("@protobuf-ts/runtime");
const host = '127.0.0.1:5000';
const employeeService = {
    getEmployee: (call, callback) => {
        const request = call.request;
        const employeeId = request.id;
        const employee = employees_1.Employee.create({
            id: employeeId,
            firstName: "John",
            lastName: "Doe",
            isRetired: false,
            previousEmployers: ["Acme", "Globex"],
            maritalStatus: 0,
            relatives: { spouse: "Jane", daughter: "Sue" }
        });
        const response = employees_1.EmployeeResponse.create({ employee: employee });
        callback(null, response);
    },
};
const fileService = {
    uploadCSV(call) {
        let sentWelcome = false;
        call.on('error', args => {
            console.log("example-node-grpc-server bidi() got error:", args);
        });
        call.on('data', request => {
            (0, runtime_1.assert)(file_1.CSVUploadRequest.is(request));
            const filename = request.fileName;
            const filecontent = request.fileContent;
            console.log(`received file: ${filename} with ${filecontent.length} bytes`);
            const validationErrors = validateCSV(filecontent);
            call.write(file_1.CSVUploadResponse.create({
                message: validationErrors, status: false
            }));
        });
        call.on('end', () => {
            setTimeout(function () {
                call.write(file_1.CSVUploadResponse.create({
                    message: "Ending the call", status: false
                }), () => {
                    const trailer = new grpc.Metadata();
                    trailer.add('trailer', 'yes');
                    call.end(trailer);
                });
            }, 250);
        });
    }
};
function getServer() {
    const server = new grpc.Server();
    server.addService(employees_grpc_server_1.employeeServiceDefinition, employeeService);
    server.addService(file_grpc_server_1.fileServiceDefinition, fileService);
    return server;
}
if (require.main === module) {
    const server = getServer();
    server.bindAsync(host, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(`Server error: ${err.message}`);
        }
        else {
            console.log(`Server bound on port: ${port}`);
            server.start();
        }
    });
}
function validateCSV(chunk) {
    console.log(chunk);
    const data = String.fromCharCode(chunk);
    // console.log(data);
    const records = data.toString().split('\n');
    let response = '';
    for (let record of records) {
        const fields = record.split(',');
        if (fields.length !== 7) {
            response += `Invalid field: ${fields}`;
        }
        if (typeof fields[0] !== 'number') {
            response += `Invalid field: ${fields}`;
        }
        if (typeof fields[1] !== 'string') {
            response += `Invalid field: ${fields}`;
        }
        if (typeof fields[2] !== 'string') {
            response += `Invalid field: ${fields}`;
        }
        return response;
    }
}
