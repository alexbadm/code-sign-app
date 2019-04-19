import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';

const data = [{
  name: 'Tanner Linsley',
  years: 14.3,
  city: 'Krasnodar',
  veteran: true,
  height: 151,
  weight: 55,
  bmi: 17.5,
  parent: '+79876541232 Валентина',
}];

const columns = [
  {
    Header: 'Ф.И.',
    accessor: 'name',
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
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ReactTable data={data} columns={columns} />
    );
  }
}
