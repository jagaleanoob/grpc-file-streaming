import { EmployeeServiceClient, IEmployeeServiceClient } from "./employees.grpc-client";
import { ChannelCredentials } from "@grpc/grpc-js";
import { FileServiceClient, IFileServiceClient } from "./file.grpc-client";
import {CSVUploadRequest, CSVUploadResponse} from "./file";
import fs from "fs";

const client = new FileServiceClient(
    "127.0.0.1:5000",
    ChannelCredentials.createInsecure(),
    {},
    {}
);

async function main() {
    await uploadCSV(client);
}

function callGetEmployee(client: IEmployeeServiceClient) {
    console.log("calling getEmployee");
    return new Promise((resolve, reject) => {
        const request = { id: 1 };
        client.getEmployee(request, (err, response) => {
            if (err) {
                console.log("error");
                reject(err);
            } else {
                console.log(response);
                resolve(response);
            }
        });
    });
}

function splitIntoChunks(data: Buffer) {
    const records = data.toString().split('\n');
    const chunkSize = 1024;
    let chunks = [];
    let currentChunk = '';

    for (let record in records){
        if (currentChunk.length + record.length > chunkSize){
            let chunkBytes = Buffer.from(currentChunk);
            chunks.push(chunkBytes);
            currentChunk = record;
        } else {
            currentChunk += record;
        }
    }

    if (currentChunk.length > 0) {
        let chunkBytes = Buffer.from(currentChunk);
        chunks.push(chunkBytes);
    }

    return chunks;
}

function uploadCSV(client: IFileServiceClient) {
    const stream = client.uploadCSV();

    stream.on('data', (response: CSVUploadResponse) => {
        console.log(response.message);
    });

    const path = require("path");
    const csvData = fs.readFileSync(path.resolve(__dirname, "../tesfile.csv"));
    const chunks = splitIntoChunks(csvData);

    chunks.forEach(chunk => {
        stream.write({ fileName: "the_filename", fileContent: chunk });
    });

    stream.end();

    return new Promise<void>(resolve => {
        stream.on('end', () => resolve());
    });
}

main().catch(e => console.error(e)).finally(() => process.exit());
