"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const storage_1 = require("./storage");
class ParticipantsStorage extends storage_1.Storage {
    constructor() {
        super("participants");
        if (!this.state.items) {
            faker_1.default.locale = 'ru';
            const fakeParticipantsCount = 30;
            this.state.items = new Array(fakeParticipantsCount);
            const cities = new Array(6);
            for (let i = 0; i < 6; i++) {
                cities[i] = faker_1.default.address.city();
            }
            for (let i = 0; i < fakeParticipantsCount; i++) {
                const height = faker_1.default.random.number(60) + 120;
                const weight = faker_1.default.random.number(70) + 25;
                this.state.items[i] = {
                    name: faker_1.default.name.findName(),
                    team: faker_1.default.random.number(15) + 1,
                    years: faker_1.default.random.number(120) / 10 + 6,
                    birthDate: faker_1.default.random.number(433900800000) + 946684800000,
                    city: cities[faker_1.default.random.number(5)],
                    veteran: faker_1.default.random.boolean(),
                    height,
                    weight,
                    bmi: (((weight / Math.pow(height / 100, 2)) * 10) | 0) / 10,
                    parent: faker_1.default.fake('{{phone.phoneNumber}} {{name.firstName}}'),
                };
            }
            this.state.items.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
        }
        global.participants = this.state;
    }
    ipcMessage([channel, type, payload]) {
        if (channel !== this.channel) {
            return this.state;
        }
        console.log('[ParticipantsStorage] ipcMessage event', [channel, type, payload]);
        return this.state;
    }
}
exports.ParticipantsStorage = ParticipantsStorage;
