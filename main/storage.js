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
    static ipcMessage(channel, input) {
        const match = Storage.instances[channel];
        return match
            ? match.ipcMessage(input)
            : console.log('[Storage.ipcMessage] not implemented for "%s" channel', channel);
    }
    static save() {
        try {
            fs_1.default.writeFileSync(filename, JSON.stringify(Storage.state, null, 2), 'utf8');
        }
        catch (e) {
            console.log('failed to save database', e);
        }
    }
}
Storage.state = fromFileState;
Storage.instances = {};
exports.Storage = Storage;
