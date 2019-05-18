"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("./storage");
class ParticipantsStorage extends storage_1.Storage {
    constructor() {
        super('participants');
        global.participants = this.state;
        if (!this.state.items) {
            this.state.items = [];
        }
    }
    ipcMessage(args) {
        console.log('[ParticipantsStorage] ipcMessage event', args);
        switch (args.type) {
            case 'addParticipant':
                this.state.items.push(args.participant);
                break;
            case 'addParticipants':
                this.state.items.push(...args.participants);
                break;
            case 'deleteFakes':
                this.state.items = this.state.items.filter(p => !p.isTest);
                break;
            default:
                console.log('[ParticipantsStorage] unexpected action', args);
        }
        this.state.items.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
        return this.state;
    }
}
exports.ParticipantsStorage = ParticipantsStorage;
