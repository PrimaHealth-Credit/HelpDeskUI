import React, { Component } from 'react';
import axios from 'axios';
import "./App.css";

class SupportTicket extends Component {
  constructor() {
    super();
    this.state = {
      RequestorName: '',
      RequestorEmail: '',
      RequestorPhone: '',
      Issues: [],
      SelectedIssue: '',
      Description: '',
      isLoading: false,
      statusMessage: '',
      submitError: false
    };
  }
  
  componentDidMount() {
    var self = this;
    let issueList = [];

    this.setState({isLoading : true});
    axios
    .get("https://dk0orvpqb3.execute-api.us-west-2.amazonaws.com/live/support/issues", {
      mode: "no-cors"
    })
    .then(response => {
      //console.log(response.data);
      issueList = response.data.map(item => {
        return {
          issueID : item.IssueID,
          issueType : item.Issue
        }
      })
      issueList.unshift({
        issueID : -99,
        issueType : 'Select One…'
      })
      console.log(issueList);
      self.setState({ Issues : issueList});
      this.setState({isLoading : false});
    })
    .catch(error => {
      console.log(error);
      this.setState({isLoading : false});
    });      
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    })
    this.setState({statusMessage: ''});
  }

  handleIssueChange = event => {
    event.preventDefault();
    this.setState({
      SelectedIssue : event.target.value
    })
    console.log(event.target.value);
  }

  handleSubmit = event => {
    event.preventDefault();

    const ticket = {
      RequestorName: this.state.RequestorName,
      RequestorEmail: this.state.RequestorEmail,
      RequestorPhone: this.state.RequestorPhone,
      Issue: this.state.SelectedIssue,
      Description: this.state.Description
    };
    console.log(ticket);
    if (this.state.SelectedIssue.startsWith('Other') && (!this.state.Description)) {
      console.log('Other issue selected, but no description');
      this.setState({submitError: true});
      this.setState({statusMessage: 'Description is required for "Other" issue'});
      return;
    }

    this.setState({submitError: false});
    this.setState({statusMessage: 'Submitting ticket...'});
    const errorMsg = 'Error - unable to submit ticket!!';
    
    axios.post(`https://dk0orvpqb3.execute-api.us-west-2.amazonaws.com/live/support`, ticket )
      .then(res => {
        console.log(res.data);
        console.log(res.status);
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
            <h1>PrimaHealth Credit Suport Ticket</h1>
            <form onSubmit={this.handleSubmit}>
                <div className="entry">
                    <label htmlFor="RequestorName">Your Name</label> 
                    <input type="text" name="RequestorName" placeholder="First Last Name" required onChange={this.handleChange} />                  
                </div>
                <div className="entry">
                    <label htmlFor="RequestorEmail">Your Email</label> 
                    <input type="text" name="RequestorEmail" placeholder="Email Address" required onChange={this.handleChange} />                  
                </div>
                <div className="entry">
                    <label htmlFor="RequestorPhone">Your Phone</label> 
                    <input type="text" name="RequestorPhone" required onChange={this.handleChange} />                  
                </div>
                <div className="entry">
                    <label htmlFor="Issue">Issue</label>
                    <select required onChange={this.handleIssueChange} disabled={this.state.isLoading ? true : false}>
                      {this.state.Issues.map((iss) => <option key={iss.issueID} 
                      value={iss.issueType.startsWith('Select') ? "" : iss.issueType}>{iss.issueType}</option>)}
                    </select> 
                </div>
                <div className="entry">
                    <label htmlFor="Description">Description</label>
                    <textarea name="Description" rows={5} onChange={this.handleChange} />                                  
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

export default SupportTicket;