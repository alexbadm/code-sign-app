"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("./storage");
class BirthdayStorage extends storage_1.Storage {
    constructor() {
        super('birthday');
        global.birthday = this.state;
        if (!this.state.fromDate || !this.state.toDate) {
            this.state.fromDate = 1559347200000;
            this.state.toDate = 1567296000000;
        }
    }
    ipcMessage(args) {
        this.state[args.type] = args.newDate;
        console.log('[BirthdayStorage] ipcMessage event', args);
        return this.state;
    }
}
exports.BirthdayStorage = BirthdayStorage;
