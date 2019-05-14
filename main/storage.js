"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let state = {};
const filename = path_1.default.join(__dirname, "database.json");
try {
    state = JSON.parse(fs_1.default.readFileSync(filename, "utf8"));
}
catch (e) {
    console.log("failed to load database", e);
}
class Storage {
    constructor(channel) {
        this.channel = channel;
        this.state = Storage.state[channel] = Storage.state[channel] || {};
        console.log("[Storage] this.state", this.state);
        Storage.instances[channel] = this;
        console.log("Storage instances", Storage.instances);
    }
    static ipcMessage(input) {
        return Storage.instances[input[0]] && Storage.instances[input[0]].ipcMessage(input);
    }
    static save() {
        try {
            fs_1.default.writeFileSync(filename, JSON.stringify(Storage.state, null, 2), "utf8");
        }
        catch (e) {
            console.log("failed to save database", e);
        }
    }
    ipcMessage(input) {
        console.log('[Storage.ipcMessage] not implemented for "%s" channel', input[0]);
        return undefined;
    }
}
Storage.state = state;
Storage.instances = {};
exports.Storage = Storage;
