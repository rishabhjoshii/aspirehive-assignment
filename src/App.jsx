import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { customerDB } from './CustomerDB';
import toast, { Toaster } from 'react-hot-toast';

function App() {

  const [customers, setCustomers] = useState(customerDB);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Open');
  const [rate, setRate] = useState('');
  const [balance, setBalance] = useState('');
  const [deposit, setDeposit] = useState('');

  // useEffect(() => {
  //   // Simulate fetching data from an API
  //   axios.get('https://jsonplaceholder.typicode.com/users')
  //     .then(response => {
  //       setCustomers(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectChange = (event, id) => {
    if (event.target.checked) {
      setSelectedCustomers([...selectedCustomers, id]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    }
  };

  const handleDeleteSelected = () => {
    setCustomers(customers.filter(customer => !selectedCustomers.includes(customer.id)));
    setSelectedCustomers([]);
    toast.success("Entries deleted successfully");
  };

  const filteredCustomers = customers?.filter(customer =>
    customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer?.Description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer?.Status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const visibleCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Function to determine the color class for the Status field
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'green-text';
      case 'unpaid': return 'gray-text';
      case 'due': return 'red-text';
      case 'open': return 'purple-text';
      default: return 'black-text';
    }
  };

  // Function to determine the color class for the financial fields
  const getFinancialColor = (value) => {
    // const valueString = String(value);
    return value.startsWith('-') ? 'red-text' : 'green-text';
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      id: customers.length + 1,
      name,
      Description: description, 
      Status: status, 
      Rate: rate,
      Balance: balance,
      Deposit: deposit,
    };
    setCustomers([...customers, newCustomer]); 
    toast.success("Customer added successfully", { duration: 5000 });
    setShowModal(false);
    setName('');
    setDescription('');
    setStatus('Open');
    setRate('');
    setBalance('');
    setDeposit('');
    
  };

  if(showModal){
    return (
      <>
      <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Customer</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Open">Open</option>
            <option value="Paid">Paid</option>
            <option value="Inactive">Inactive</option>
            <option value="Due">Due</option>
          </select>
          <label>Rate</label>
          <input type="text" value={rate} placeholder='$0.00' onChange={(e) => setRate(e.target.value)} required />
          <label>Balance</label>
          <input type="text" value={balance} placeholder='$0.00' onChange={(e) => setBalance(e.target.value)} required />
          <label>Deposit</label>
          <input type="text" value={deposit} placeholder='$0.00' onChange={(e) => setDeposit(e.target.value)} required />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
        </form>
      </div>
    </div>
      </>
    )
  }

  return (
    <>
      <div>
        <Toaster
          position="top-center"
          reverseOrder={false}
        ></Toaster>
      </div>
      <div className="container">
        <header>
          <h1>Customer Data</h1>
          {/*<button onClick={() => {
            const newCustomer = {
              id: customers.length + 1,
              name: prompt('Enter customer name:'),
              Description: prompt('Enter customer Description:'),
              Status: prompt('Enter customer Status:'),
              Rate: prompt('Enter customer Rate:'),
              Balance: prompt('Enter customer Balance:'),
              Deposit: prompt('Enter customer Deposit:')
            };
            setCustomers([...customers, newCustomer]);
            toast.success("Entry added successfully!");
          }}>Add Customer</button>*/}
          <button onClick={() => setShowModal(true)}>Add Customer</button>
        </header>
        <div className="controls">
          {selectedCustomers.length > 0 ? (
            <button onClick={handleDeleteSelected} className='delBtn'>
              Delete Selected
            </button>
          ) : (<div></div>)}
          <input className='searchInput' type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search..." />
        </div>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Rate</th>
              <th>Balance</th>
              <th>Deposit</th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.map(customer => (
              <tr key={customer.id} className={selectedCustomers.includes(customer.id) ? 'selected' : 'notSelected'}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={(e) => handleSelectChange(e, customer.id)}
                  />
                </td>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.Description}</td>
                <td className={getStatusColor(customer.Status)}>{customer.Status}</td>
                <td>{customer.Rate}</td>
                <td className={getFinancialColor(customer.Balance)}>{customer.Balance}</td>
                <td>{customer.Deposit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          <div>
          <span>Page {currentPage} of {totalPages}</span>
          {/* Dropdown for rows per page */}
          <select style={{ marginLeft: '10px' }} value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))}>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={15}>15 per page</option>
            <option value={20}>20 per page</option>
          </select>
          </div>
          

          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </>
  );
}

export default App;


