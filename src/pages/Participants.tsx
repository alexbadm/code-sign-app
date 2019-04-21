import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import faker from 'faker';

faker.locale = 'ru';
const fakeParticipantsCount = 30;
const data = new Array(fakeParticipantsCount);
for (let i = 0; i < fakeParticipantsCount; i++) {
  const height = faker.random.number(60) + 120;
  const weight = faker.random.number(70) + 25;
  data[i] = {
    name: faker.name.findName(),
    team: faker.random.number(15) + 1,
    years: faker.random.number(120) / 10 + 6,
    city: faker.address.city(),
    veteran: faker.random.boolean,
    height,
    weight,
    bmi: (weight / Math.pow(height / 100, 2) * 10 | 0) / 10,
    parent: faker.fake("{{phone.phoneNumber}} {{name.firstName}}"),
  };
}

const columns = [
  {
    Header: 'Ф.И.',
    accessor: 'name',
  },
  {
    Header: 'команда',
    accessor: 'team',
  },
  {
    Header: 'кол-во лет',
    accessor: 'years',
  },
  {
    Header: 'нас.пункт',
    accessor: 'city',
  },
  {
    Header: 'участвовал КЗ ранее',
    accessor: 'veteran',
  },
  {
    Header: 'рост,см',
    accessor: 'height',
  },
  {
    Header: 'вес,кг',
    accessor: 'weight',
  },
  {
    Header: 'ИМТ',
    accessor: 'bmi',
  },
  {
    Header: 'родитель',
    accessor: 'parent',
  },
];

export class Participants extends Component {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ReactTable
        data={data}
        columns={columns}
        showPagination={false}
        defaultPageSize={fakeParticipantsCount}
        sorted={[{id: 'name', desc: false}]}
        style={{height: "600px"}}
      />
    );
  }
}
