import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import './Table.css';

function TableComponent({ data,onButtonClick  }) {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleDelete = (index) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
    localStorage.setItem('weather_history_data', JSON.stringify(newData))
  };

  const handleButtonClick = (City_Country) => {
    onButtonClick(City_Country);
  };

  return (
    <Table striped hover responsive className='weather_history_table'>
      {/* <thead>
        <tr>
          <th>Name</th>
          <th>International Date</th>
          <th>Searched Date</th>
          <th></th>
          <th></th>
        </tr>
      </thead> */}
      <tbody>
        {tableData.map((item, index) => (
          <tr key={index}>
            <td>{item.City_Country}</td>
            <td style={{color:'transparent'}}>{item.local_datetime}</td>
            <td style={{minWidth:'100px'}}>{item.international_datetime}</td>
            <td><Button className='search_button_in_table' variant="Dark" onClick={() => handleButtonClick(item.City_Country)} ><FontAwesomeIcon icon={faMagnifyingGlass} /></Button></td>
            <td><Button className='delete_button_in_table' variant="Dark" onClick={() => handleDelete(index)}><FontAwesomeIcon icon={faTrash} /></Button></td> 
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export { TableComponent };