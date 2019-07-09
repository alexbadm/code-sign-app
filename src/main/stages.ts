import { AppStageConfig, AppStageResults, AppStagesAction, AppStagesState } from 'electron';
import { Storage } from './storage';

export class StagesStorage extends Storage {
  protected readonly state!: AppStagesState;

  constructor() {
    super('stages');
    global.stages = this.state;
    if (!this.state.stages) {
      this.state.stages = [];
    }
    if (typeof this.state.penaltyPoint !== 'number') {
      this.state.penaltyPoint = 0;
    }
    if (!this.state.stageResults) {
      this.state.stageResults = {};
    }
  }

  public ipcMessage(action: AppStagesAction): AppStagesState {
    console.log('[StagesStorage] ipcMessage event', action);
    switch (action.type) {
      case 'setPenaltyPoint':
        this.state.penaltyPoint = action.penaltyPoint;
        this.state.stages.forEach((s) => (s.penaltyPoint = action.penaltyPoint));
        break;
      case 'setStagesCount':
        this.setStagesCount(action.count);
        break;
      case 'updateStageConfig':
        this.updateStage(action.stage);
        break;
      case 'updateStageResults':
        this.updateStageResults(action.stageId, action.results);
        break;
      default:
        console.log('[ipcMessage] unexpected action', action);
    }
    return this.state;
  }

  private setStagesCount(count: number): void {
    if (this.state.stages.length === count) {
      return;
    }
    if (this.state.stages.length > count) {
      const toDelete = this.state.stages.slice(count);
      toDelete.forEach((s) => delete this.state.stageResults[s.id]);
      this.state.stages = this.state.stages.slice(0, count);
    } else {
      this.state.stages = this.state.stages.concat(
        this.generateStages(
          count - this.state.stages.length,
          this.state.stages.reduce((a, b) => Math.max(a, b.id), 0) + 1,
        ),
      );
    }
  }

  private updateStage(stage: AppStageConfig): void {
    const needed = this.state.stages.find((s) => s.id === stage.id);
    if (needed) {
      Object.assign(needed, stage);
    }
  }

  private updateStageResults(stageId: number, results: AppStageResults[]): void {
    this.state.stageResults[stageId] = results;
  }

  private generateStages(count: number, fromId: number): AppStageConfig[] {
    const result: AppStageConfig[] = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = {
        doCountParticipants: false,
        id: i + fromId,
        name: '',
        penaltyPoint: this.state.penaltyPoint,
        ranking: 'THE_MORE_THE_BETTER',
        responsible: '',
      };
    }
    return result;
  }
}
