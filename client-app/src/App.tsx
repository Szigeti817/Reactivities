import React, { Component } from "react";
import logo, { ReactComponent } from "./logo.svg";
import "./App.css";
import { Header, Icon } from "semantic-ui-react";
import Axios from "axios";

class App extends Component {
  state = {
    values: [],
  };
  componentDidMount() {
    Axios.get("http:localhost:5000/api/values").then((response) => {
      this.setState({
        values: response.data,
      });
    });
  }
  render() {
    return (
      <div>
        <Header as="h2">
          <Icon name="users" />
          <Header.Content>Reactivities</Header.Content>
        </Header>
      </div>
    );
  }
}

export default App;
