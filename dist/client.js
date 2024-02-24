"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_js_1 = require("@grpc/grpc-js");
const file_grpc_client_1 = require("./file.grpc-client");
const fs_1 = __importDefault(require("fs"));
const client = new file_grpc_client_1.FileServiceClient("127.0.0.1:5000", grpc_js_1.ChannelCredentials.createInsecure(), {}, {});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield uploadCSV(client);
    });
}
function callGetEmployee(client) {
    console.log("calling getEmployee");
    return new Promise((resolve, reject) => {
        const request = { id: 1 };
        client.getEmployee(request, (err, response) => {
            if (err) {
                console.log("error");
                reject(err);
            }
            else {
                console.log(response);
                resolve(response);
            }
        });
    });
}
function splitIntoChunks(data) {
    const records = data.toString().split('\n');
    const chunkSize = 1024;
    let chunks = [];
    let currentChunk = '';
    for (let record in records) {
        if (currentChunk.length + record.length > chunkSize) {
            let chunkBytes = Buffer.from(currentChunk);
            chunks.push(chunkBytes);
            currentChunk = record;
        }
        else {
            currentChunk += record;
        }
    }
    if (currentChunk.length > 0) {
        let chunkBytes = Buffer.from(currentChunk);
        chunks.push(chunkBytes);
    }
    return chunks;
}
function uploadCSV(client) {
    const stream = client.uploadCSV();
    stream.on('data', (response) => {
        console.log(response.message);
    });
    const path = require("path");
    const csvData = fs_1.default.readFileSync(path.resolve(__dirname, "../tesfile.csv"));
    const chunks = splitIntoChunks(csvData);
    chunks.forEach(chunk => {
        stream.write({ fileName: "the_filename", fileContent: chunk });
    });
    stream.end();
    return new Promise(resolve => {
        stream.on('end', () => resolve());
    });
}
main().catch(e => console.error(e)).finally(() => process.exit());
