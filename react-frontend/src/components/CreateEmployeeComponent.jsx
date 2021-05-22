import React, { Component } from "react";
import EmployeeService from "../services/EmployeeService";
import Recaptcha from "react-recaptcha";
class CreateEmployeeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // step 2
      recaptcha: undefined,
      isVerified: false,
      id: this.props.match.params.id,
      firstName: "",
      lastName: "",
      emailId: "",
    };
    this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
    this.changeLastNameHandler = this.changeLastNameHandler.bind(this);
    this.saveOrUpdateEmployee = this.saveOrUpdateEmployee.bind(this);
    this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  // step 3
  componentDidMount() {
    // step 4
    if (this.state.id === "_add") {
      return;
    } else {
      EmployeeService.getEmployeeById(this.state.id).then((res) => {
        let employee = res.data;
        this.setState({
          firstName: employee.firstName,
          lastName: employee.lastName,
          emailId: employee.emailId,
        });
      });
    }
  }

  recaptchaLoaded = (e) => {
    console.log("capcha successfully loaded");
  };

  verifyCallback = (response) => {
    if (response) {
      this.setState({ ...this.state, recaptcha: response, isVerified: true });
    }
  };

  saveOrUpdateEmployee = (e) => {
    e.preventDefault();
    let employee = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        emailId: this.state.emailId,
        recaptcha : this.state.recaptcha,
      };
    let recaptcha = this.state.recaptcha;
    // step 5
    if (this.state.isVerified) {
      if (this.state.id === "_add") {
        EmployeeService.createEmployee(employee).then((res) => {
           this.props.history.push("/employees");
        });
      } else {
        EmployeeService.updateEmployee(employee, this.state.id).then((res) => {
          this.props.history.push("/employees");
        });
      }
    } else {
      alert("Please verify that you are a human!");
    }
  };

  changeFirstNameHandler = (event) => {
    this.setState({ firstName: event.target.value });
  };

  changeLastNameHandler = (event) => {
    this.setState({ lastName: event.target.value });
  };

  changeEmailHandler = (event) => {
    this.setState({ emailId: event.target.value });
  };

  cancel() {
    this.props.history.push("/employees");
  }

  getTitle() {
    if (this.state.id === "_add") {
      return <h3 className="text-center">Add Employee</h3>;
    } else {
      return <h3 className="text-center">Update Employee</h3>;
    }
  }
  render() {
    return (
      <div>
        <br></br>
        <div className="container">
          <div className="row">
            <div className="card col-md-6 offset-md-3 offset-md-3">
              {this.getTitle()}
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label> First Name: </label>
                    <input
                      placeholder="First Name"
                      name="firstName"
                      className="form-control"
                      value={this.state.firstName}
                      onChange={this.changeFirstNameHandler}
                    />
                  </div>
                  <div className="form-group">
                    <label> Last Name: </label>
                    <input
                      placeholder="Last Name"
                      name="lastName"
                      className="form-control"
                      value={this.state.lastName}
                      onChange={this.changeLastNameHandler}
                    />
                  </div>
                  <div className="form-group">
                    <label> Email Id: </label>
                    <input
                      placeholder="Email Address"
                      name="emailId"
                      className="form-control"
                      value={this.state.emailId}
                      onChange={this.changeEmailHandler}
                    />
                  </div>

                  <button
                    className="btn btn-success"
                    onClick={this.saveOrUpdateEmployee}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={this.cancel.bind(this)}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                </form>
                <Recaptcha
                  sitekey="6Le1iN8aAAAAAM8etrZVSKp7W7l_g8tq3ceM-33j"
                  render="explicit"
                  onloadCallback={this.recaptchaLoaded}
                  verifyCallback={this.verifyCallback}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateEmployeeComponent;
