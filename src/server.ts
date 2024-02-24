import * as grpc from '@grpc/grpc-js';
import {CSVUploadRequest, CSVUploadResponse} from "./file";
import {Employee, EmployeeRequest, EmployeeResponse} from "./employees";
import {IFileService, fileServiceDefinition} from "./file.grpc-server"
import {IEmployeeService, employeeServiceDefinition} from "./employees.grpc-server";
import {assert} from "@protobuf-ts/runtime";


const host = '127.0.0.1:5000';

const employeeService: IEmployeeService = {

    getEmployee: (
        call: grpc.ServerUnaryCall<EmployeeRequest, EmployeeResponse>, 
        callback: grpc.sendUnaryData<EmployeeResponse>
    ) => {
        const request = call.request;
        const employeeId = request.id;
        const employee = Employee.create({
            id: employeeId,
            firstName: "John",
            lastName: "Doe",
            isRetired: false,
            previousEmployers: ["Acme", "Globex"],
            maritalStatus: 0,
            relatives: {spouse: "Jane", daughter: "Sue"}
        });

        const response = EmployeeResponse.create({employee: employee});
        callback(null, response);
    },
}

const fileService: IFileService = {

    uploadCSV(call: grpc.ServerDuplexStream<CSVUploadRequest, CSVUploadResponse>): void {

        let sentWelcome = false;

        call.on('error', args => {
            console.log("example-node-grpc-server bidi() got error:", args)
        })

        call.on('data', request => {
            assert(CSVUploadRequest.is(request));
            const filename = request.fileName;
            const filecontent = request.fileContent;
            console.log(`received file: ${filename} with ${filecontent.length} bytes`);
            const validationErrors = validateCSV(filecontent);
            call.write(CSVUploadResponse.create({
                message: validationErrors, status: false
            }));
        });

        call.on('end', () => {
            setTimeout(function (){

                call.write(CSVUploadResponse.create({
                message: "Ending the call", status: false
                }), () => {
                    const trailer = new grpc.Metadata();
                    trailer.add('trailer', 'yes');
                    call.end(trailer);
                });
            }, 250);
        });
    }
}

function getServer(): grpc.Server {
    const server = new grpc.Server();
    server.addService(employeeServiceDefinition, employeeService);
    server.addService(fileServiceDefinition, fileService);
    return server;
}

if (require.main === module) {
    const server = getServer();
    server.bindAsync(
        host,
        grpc.ServerCredentials.createInsecure(),
        (err: Error | null, port: number) => {
            if (err) {
                console.error(`Server error: ${err.message}`);
            } else {
                console.log(`Server bound on port: ${port}`);
                server.start();
            }
        }
    );
}

function validateCSV(chunk: Uint8Array) {
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

