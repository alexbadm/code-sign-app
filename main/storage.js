"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let fromFileState = {};
const filename = path_1.default.join(__dirname, 'database.json');
try {
    fromFileState = JSON.parse(fs_1.default.readFileSync(filename, 'utf8'));
}
catch (e) {
    console.log('failed to load database', e);
}
class Storage {
    constructor(channel) {
        this.channel = channel;
        this.state = Storage.state[channel] = Storage.state[channel] || {};
        console.log('[Storage] <%s> this.state', channel, this.state);
        Storage.instances[channel] = this;
        console.log('Storage instances', Storage.instances);
    }
    static handleIpcMessage(channel, action) {
        const store = Storage.instances[channel];
        if (store && Storage.webContents) {
            Storage.webContents.send(channel, store.ipcMessage(action));
        }
    }
    static registerWebContents(wc) {
        Storage.webContents = wc;
    }
    static save() {
        try {
            fs_1.default.writeFileSync(filename, JSON.stringify(Storage.state, null, 2), 'utf8');
        }
        catch (e) {
            console.log('failed to save database', e);
        }
    }
    static sendState(channel) {
        const store = Storage.instances[channel];
        if (store && Storage.webContents) {
            Storage.webContents.send(channel, store.state);
        }
    }
}
Storage.state = fromFileState;
Storage.instances = {};
exports.Storage = Storage;
