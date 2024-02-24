// @generated by protobuf-ts 2.9.3 with parameter server_grpc1,client_grpc1,optimize_code_size
// @generated from protobuf file "file.proto" (syntax proto3)
// tslint:disable
import { FileService } from "./file";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { CSVUploadResponse } from "./file";
import type { CSVUploadRequest } from "./file";
import * as grpc from "@grpc/grpc-js";
/**
 * @generated from protobuf service FileService
 */
export interface IFileServiceClient {
    /**
     * @generated from protobuf rpc: UploadCSV(stream CSVUploadRequest) returns (stream CSVUploadResponse);
     */
    uploadCSV(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<CSVUploadRequest, CSVUploadResponse>;
    uploadCSV(options?: grpc.CallOptions): grpc.ClientDuplexStream<CSVUploadRequest, CSVUploadResponse>;
}
/**
 * @generated from protobuf service FileService
 */
export class FileServiceClient extends grpc.Client implements IFileServiceClient {
    private readonly _binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions>;
    constructor(address: string, credentials: grpc.ChannelCredentials, options: grpc.ClientOptions = {}, binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions> = {}) {
        super(address, credentials, options);
        this._binaryOptions = binaryOptions;
    }
    /**
     * @generated from protobuf rpc: UploadCSV(stream CSVUploadRequest) returns (stream CSVUploadResponse);
     */
    uploadCSV(metadata?: grpc.Metadata | grpc.CallOptions, options?: grpc.CallOptions): grpc.ClientDuplexStream<CSVUploadRequest, CSVUploadResponse> {
        const method = FileService.methods[0];
        return this.makeBidiStreamRequest<CSVUploadRequest, CSVUploadResponse>(`/${FileService.typeName}/${method.name}`, (value: CSVUploadRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): CSVUploadResponse => method.O.fromBinary(value, this._binaryOptions), (metadata as any), options);
    }
}