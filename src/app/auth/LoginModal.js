import React, { Component } from "react";
import qs from "query-string";
import Modal from "react-modal";

import config from "../../config/index";
import Octicon from "../../components/Octicon";
import * as analytics from "../../components/GoogleAnalytics";
import cookie from "js-cookie";
import * as api from "../apiActions";
import * as localStorage from "../utils/localStorage";

const GITHUB_PARAMS = qs.stringify({
  client_id: config.githubOAuthClientId,
  redirect_uri: config.githubOAuthRedirectURI
});
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?${GITHUB_PARAMS}`;

if (process.env.NODE_ENV !== "test") {
  Modal.setAppElement("#root");
}

const ERRORS = { REQUIRED: "Required", INVALID: "Invalid" };

class LoginModal extends Component {
  state = {
    profile: { email: "", password: "" },
    errors: { email: undefined, form: undefined }
  };

  validateEmail = email => {
    const isValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    const validMessage = !isValid ? ERRORS.INVALID : undefined;
    return email.length === 0 ? ERRORS.REQUIRED : validMessage;
  };

  onChange = e =>
    this.setState({
      profile: { ...this.state.profile, [e.target.name]: e.target.value }
    });

  onSubmit = e => {
    e.preventDefault();
    const { profile, errors } = this.state;
    const { email, name, username } = profile;

    this.setState(
      {
        errors: {
          ...errors,
          email: this.validateEmail(email || ""),
        }
      },
      () => this.loginUser()
    );
  };

  loginUser = () => {
    const { errors } = this.state;
    if (!errors.email) {
      api
        .loginUser(this.state.profile)
        .then(response => {
          analytics.logLoginAction("User signed up");
          const token = response.headers.authorization.split(" ")[1];
          cookie.set("token", token);
          cookie.set("user", response.data);
          this.syncPinnedDecks();
          this.syncStudySessions();
          this.syncStudyProgress();
          this.props.onClose();
        })
        .catch(this.handleError);
    }
  };

  syncPinnedDecks = () => {
    const pinnedDecks = localStorage.getPinnedDecks();
    if (pinnedDecks.length > 0) {
      api.addPinnedDecks(pinnedDecks).catch(this.handleError);
    }
  };

  syncStudySessions = () => {
    const studySessions = localStorage.getStudySessions();
    if (studySessions.length > 0) {
      api.addStudySessions(studySessions).catch(this.handleError);
    }
  };

  syncStudyProgress = () => {
    const studyProgress = localStorage.getStudyProgress();
    if (studyProgress.length > 0) {
      api.addStudyProgress(studyProgress).catch(this.handleError);
    }
  };

  handleError = error => {
    const { status } = error.response;
    const formMessage =
      status === 403
        ? "Email or password incorrect"
        : "Something went wrong with the request. Please contact us.";
    this.setState({ errors: { ...this.state.errors, form: formMessage } });
  };

  render() {
    const { profile = {}, errors = {} } = this.state;
    const { isOpen, onClose } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        className="loginModal"
        overlayClassName="loginModal-overlay"
      >
        <button
          className="loginModal-close btn btn-reset p-2"
          onClick={onClose}
        >
          <Octicon name="x" />
        </button>
        <div className="py-5 px-4 my-2 mx-auto" style={{ maxWidth: "400px" }}>
          <div className="text-center mx-auto">
            <h5 className="mb-1">Login to Flashcards for Students</h5>
            <p className="text-secondary font-weight-light">
              Sign in to save your progress and track your favorite decks across
              devices.
            </p>
          </div>

          {errors.form && (
            <small className="text-danger text-uppercase ml-2 shake--error">
              {errors.form}
            </small>
          )}

          <form action="#" onSubmit={this.onSubmit}>
            <div className="form-group">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label
                  className="small font-weight-bold m-0  "
                  style={{ opacity: 0.85 }}
                >
                  Enter your email address
                </label>
              </div>
              <input
                type="text"
                name="email"
                className="form-control form-control-sm"
                placeholder="you@your-domain.com"
                onChange={this.onChange}
                value={profile.email || ""}
              />
            </div>
            <div className="form-group mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label
                  className="small font-weight-bold m-0  "
                  style={{ opacity: 0.85 }}
                >
                  Choose a password
                </label>
                {errors.password && (
                  <small className="text-danger text-uppercase ml-2 shake--error">
                    {errors.password}
                  </small>
                )}
              </div>
              <input
                type="password"
                name="password"
                className="form-control form-control-sm"
                placeholder="•••••••••••••"
                onChange={this.onChange}
                value={profile.password || ""}
              />
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button
                type="submit"
                className="loginModal-button btn btn-sm btn-outline-dark"
                onClick={() =>
                  analytics.logLoginAction("Clicked on GitHub login button")
                }
              >
                <small className="font-weight-bold">Log in</small>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}

export default LoginModal;
