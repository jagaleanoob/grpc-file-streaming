"use strict";
// Function for splitting a csv into chunks keeping in mind to split only after end of line:
function splitIntoChunks(data) {
    const records = data.toString().split('\n');
    const chunkSize = 102400;
    let chunks = [];
    let currentChunk = '';
    for (let record in records) {
        if (currentChunk.length + records.length > chunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk);
            currentChunk = record;
        }
        else {
            currentChunk += records;
        }
    }
    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }
    return chunks;
}
