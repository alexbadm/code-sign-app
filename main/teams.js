"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("./storage");
class TeamsStorage extends storage_1.Storage {
    constructor() {
        super("teams");
        global.teams = this.state;
        if (!this.state.config || !this.state.config.algorithm) {
            this.state.config = {
                algorithm: "teamSize",
                teamSize: 8,
                teamsCount: 15,
            };
        }
    }
    ipcMessage([channel, type, newConfig]) {
        if (channel === this.channel && type === 'config') {
            this.state.config = newConfig;
            console.log('[TeamsStorage] ipcMessage event', [channel, type, newConfig]);
        }
        return this.state;
    }
}
exports.TeamsStorage = TeamsStorage;
