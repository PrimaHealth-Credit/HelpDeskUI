import './App.css';
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import SupportTicket from "./SupportTicket";
import NewHireTicket from "./NewHireTicket";

class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render () {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={SupportTicket} />
            <Route path="/SupportTicket" component={SupportTicket} />
            <Route path="/NewHireTicket" component={NewHireTicket} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
