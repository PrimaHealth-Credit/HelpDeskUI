import React from 'react';
import axios from 'axios';

import "./App.css";

export default class NewHireTicket extends React.Component {
  
  constructor() {
    super(); 
    this.state = {
      RequestorEmail: '',
      RequestorPhone: '',
      HiringManager: '',
      JobPosition: '',
      StartDate: '',
      FirstName: '',
      LastName: '',
      EmailAddress: '',
      PhoneNumber: '',
      isLoading: false,
      Departments: [],
      SelectedDepartmentName: '',
      Department: {},
      statusMessage: '',
      submitError: false
    }
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
        [event.target.name]: event.target.value
    })
  }

  componentDidMount() {
    var self = this;
    let deptList = [];

    this.setState({isLoading : true});
    axios
    .get("https://dk0orvpqb3.execute-api.us-west-2.amazonaws.com/live/departments", {
      mode: "no-cors"
    })
    .then(response => {
      //console.log(response.data);
      deptList = response.data.map(item => {
        return {
          DepartmentID: item.DepartmentID,
          Name : item.Name,
          EmailAddress : item.EmailAddress
        }
      })
      deptList.unshift({
        DepartmentID : -99,
        Name : 'Select One…',
        EmailAddress : ''
      })
      console.log(deptList);
      self.setState({ Departments : deptList});
      this.setState({isLoading : false});
      //console.log(this.state.SelectedDepartmentName);
    })
    .catch(error => {
      console.log(error);
      this.setState({isLoading : false});
    });      
  }

  handleDeptChange = event => {
    event.preventDefault();
    this.setState({
      SelectedDepartmentName : event.target.value
    })
    console.log('Selected Dept: ' + event.target.value);
  }

  handleSubmit = event => {
    event.preventDefault();
   
    let selectedDept = {};
    this.state.Departments.forEach((dept) => {
      if (dept.Name === this.state.SelectedDepartmentName) {
        selectedDept = dept;
        return;
      }
    })

    const ticket = {
        RequestorEmail: this.state.RequestorEmail,
        RequestorPhone: this.state.RequestorPhone,
        RequestorName: this.state.HiringManager,
        Department:  selectedDept,
        JobPosition: this.state.JobPosition,
        StartDate: this.state.StartDate,
        FirstName: this.state.FirstName,
        LastName: this.state.LastName,
        EmailAddress: this.state.EmailAddress,
        PhoneNumber: this.state.PhoneNumber
    };

    console.log(ticket);
    this.setState({submitError: false});
    this.setState({statusMessage: 'Submitting ticket...'});
    const errorMsg = 'Error - unable to create ticket!!';

    axios.post(`https://dk0orvpqb3.execute-api.us-west-2.amazonaws.com/live/support/newhire`, ticket )
      .then(res => {
        console.log(res);
        console.log(res.data);
        if (res.status === 200) {
          this.setState({statusMessage: 'Ticket has been created successfully!'});
        } else {
          this.setState({submitError: true});
          this.setState({statusMessage: errorMsg});
        } 
      })
      .catch(err => {
        console.log(err);    
        this.setState({submitError: true});
        this.setState({statusMessage: errorMsg});
      })
  }

  render() {
    return (
      <div className="wrapper">
          <div className="form-wrapper">
            <h1>PrimaHealth Credit New-Hire Ticket</h1>
            <form onSubmit={this.handleSubmit}>
            <div className="entry">
                <label htmlFor="HiringManager">Hiring Manager</label>
                    <input type="text" name="HiringManager" placeholder="First Last Name" required onChange={this.handleChange} />                                  
                </div>
                <div className="entry">
                    <label htmlFor="RequestorEmail">Hiring Manager Email</label>
                    <input type="text" name="RequestorEmail" placeholder="Email Address" required onChange={this.handleChange} />                  
                </div>
                <div className="entry">
                    <label htmlFor="RequestorPhone">Hiring Manager Phone</label> 
                    <input type="text" name="RequestorPhone" required onChange={this.handleChange} />                  
                </div>
                <div className="line">
                  <hr />
                </div>
                <div className="entry">
                    <label htmlFor="Department">Department</label>
                    <select required onChange={this.handleDeptChange} disabled={this.state.isLoading ? true : false}>
                      {this.state.Departments.map((dept) => <option key={dept.DepartmentID} 
                        value={dept.Name.startsWith('Select') ? "" : dept.Name}>{dept.Name}</option>)}
                    </select> 
                </div>
                <div className="entry">
                    <label htmlFor="JobPosition">Job Position</label>
                    <input type="text" name="JobPosition" required onChange={this.handleChange} />                  
                </div>
                <div className="entry">
                    <label htmlFor="StartDate">Start Date</label>
                    <input type="text" name="StartDate" placeholder="mm/dd/yyyy" required onChange={this.handleChange} />                   
                </div>
                <div className="firstName">
                    <label htmlFor="FirstName">First Name</label>
                    <input type="text" name="FirstName" placeholder="First Name" required onChange={this.handleChange} />                                  
                </div>
                <div className="lastName">
                    <label htmlFor="LastName">Last name</label>
                    <input type="text" name="LastName" placeholder="Last Name" required onChange={this.handleChange} />                                  
                </div>
                <div className="entry">
                    <label htmlFor="EmailAddress">Personal Email</label>
                    <input type="text" name="EmailAddress" placeholder="Email Address" required onChange={this.handleChange} />                                  
                </div>
                <div className="entry">
                    <label htmlFor="PhoneNumber">Personal Mobile Number</label>
                    <input type="text" name="PhoneNumber" required onChange={this.handleChange} />                                  
                </div>
                <div className="statusMessage">
                    {this.state.statusSuccess && (
                        <span name="statusMessage">Status Message</span> 
                    )}
                </div>
                <div className={this.state.submitError ? "errorMessage" : "statusMessage"}>
                    {this.state.statusMessage && (
                        <span name="statusMessage">{this.state.statusMessage}</span> 
                    )}
                </div>
                <div className="createTicket">
                    <button type="submit">Create Ticket</button>
                </div>
                <div className="sla">
                    <label htmlFor="sla">Every effort will be made to contact you within 2 hours</label>                             
                </div>
            </form>
        </div>
      </div>
    )
  }
}