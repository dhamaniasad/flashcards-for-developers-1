import React from "react";
import cookie from "js-cookie";
import { Redirect } from "react-router-dom";

class Logout extends React.Component {
  componentWillMount() {
    cookie.remove("token");
    cookie.remove("user");
    window.location = "/";
  }

  render() {
    return "";
  }
}

export default Logout;
