// @generated by protobuf-ts 2.9.3 with parameter server_grpc1,client_grpc1,optimize_code_size
// @generated from protobuf file "file.proto" (syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message CSVUploadRequest
 */
export interface CSVUploadRequest {
    /**
     * @generated from protobuf field: string file_name = 1;
     */
    fileName: string;
    /**
     * @generated from protobuf field: bytes file_content = 2;
     */
    fileContent: Uint8Array;
}
/**
 * @generated from protobuf message CSVUploadResponse
 */
export interface CSVUploadResponse {
    /**
     * @generated from protobuf field: string message = 1;
     */
    message: string;
    /**
     * @generated from protobuf field: bool status = 2;
     */
    status: boolean;
}
// @generated message type with reflection information, may provide speed optimized methods
class CSVUploadRequest$Type extends MessageType<CSVUploadRequest> {
    constructor() {
        super("CSVUploadRequest", [
            { no: 1, name: "file_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "file_content", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message CSVUploadRequest
 */
export const CSVUploadRequest = new CSVUploadRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CSVUploadResponse$Type extends MessageType<CSVUploadResponse> {
    constructor() {
        super("CSVUploadResponse", [
            { no: 1, name: "message", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "status", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message CSVUploadResponse
 */
export const CSVUploadResponse = new CSVUploadResponse$Type();
/**
 * @generated ServiceType for protobuf service FileService
 */
export const FileService = new ServiceType("FileService", [
    { name: "UploadCSV", serverStreaming: true, clientStreaming: true, options: {}, I: CSVUploadRequest, O: CSVUploadResponse }
]);
