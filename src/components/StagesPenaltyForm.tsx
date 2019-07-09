import React, { Component } from 'react';
import { Button } from 'react-desktop/windows';

interface IStagesPenaltyFormProps {
  penalty: number;
  change: (p: number) => void;
}

interface IStagesPenaltyFormState {
  penalty: number;
}

export class StagesPenaltyForm extends Component<IStagesPenaltyFormProps, IStagesPenaltyFormState> {
  constructor(props: IStagesPenaltyFormProps) {
    super(props);
    this.state = {
      penalty: props.penalty,
    };
  }

  public render() {
    return (
      <div className="StagesPenaltyForm">
        <label>
          Штрафной балл
          <br />
          <input
            type="number"
            step="1"
            min="0"
            value={this.state.penalty}
            onChange={(e) => this.setState({ penalty: Number(e.target.value) })}
          />{' '}
          секунд
        </label>
        <br />
        <Button children="Применить" onClick={() => this.props.change(this.state.penalty)} />
      </div>
    );
  }
}
