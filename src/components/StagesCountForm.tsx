import React, { Component } from 'react';
import { Button } from 'react-desktop/windows';

interface IStagesCountFormProps {
  count: number;
  change: (c: number) => void;
}

interface IStagesCountFormState {
  count: number;
}

export class StagesCountForm extends Component<IStagesCountFormProps, IStagesCountFormState> {
  constructor(props: IStagesCountFormProps) {
    super(props);
    this.state = {
      count: props.count,
    };
  }

  public render() {
    return (
      <div className="StagesCountForm">
        <label>
          Количество этапов
          <br />
          <input
            type="number"
            step="1"
            min="0"
            value={this.state.count}
            onChange={(e) => this.setState({ count: Number(e.target.value) })}
          />
        </label>
        <br />
        <Button
          children="Применить"
          onClick={() => {
            if (isNaN(this.state.count)) {
              alert('Введено некорректное значение. Ожидается число');
              return;
            }
            if (this.state.count === this.props.count) {
              return;
            }
            if (
              this.state.count > this.props.count ||
              window.confirm(
                `Уменьшение количества этапов приведет удалению последних ${this.props.count -
                  this.state.count} из списка`,
              )
            ) {
              this.props.change(this.state.count);
            }
          }}
        />
      </div>
    );
  }
}
