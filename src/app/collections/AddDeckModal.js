import React, { Component } from "react";
import qs from "query-string";
import Modal from "react-modal";

import config from "../../config/index";
import Octicon from "../../components/Octicon";
import * as analytics from "../../components/GoogleAnalytics";
import cookie from "js-cookie";
import * as api from "../apiActions";
import * as localStorage from "../utils/localStorage";
import DeckItem from "../home/DeckItem";
import isAuthenticated from "../utils/isAuthenticated";
const _ = require("lodash");

if (process.env.NODE_ENV !== "test") {
  Modal.setAppElement("#root");
}

const ERRORS = { REQUIRED: "Required", INVALID: "Invalid" };

class AddDeckModal extends Component {
  state = {
    profile: { email: "", password: "" },
    errors: { email: undefined, form: undefined },
    isLoading: true,
    decks: [],
    decksInCollection: []
  };


  fetchDecks = () => {
    api.fetchDecks().then(
      ({ data }) => {
        this.setState({ decks: data, isLoading: false });
      },
      error => this.setState({ isError: true, isLoading: false }),
    );
  };

  toggleDeck = () => {

  };

  onToggleCollection = (event, deck) => {
    event.preventDefault();
    if (!isAuthenticated()) {
    } else {
      const isInCollection = this.isInCollection(deck._id);
      api
        .toggleDeckInCollection({ collectionId: this.props.collection._id, deck: deck._id, isInCollection })
        .then(response => {
          window.location.reload();
        })
        .catch(this.handleError);
    }
  };

  isInCollection = id => !!this.state.decksInCollection.find(el => el === id);

  componentDidMount() {
    let decks = this.props.collection.decks || [];
    let _decks = [];
    for (var i = 0; i < decks.length; i++) {
      _decks.push(decks[i]._id);
    }
    this.setState({ decksInCollection: _decks });
    this.fetchDecks();
  }

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

  handleError = error => {
    const { status } = error.response;
    const formMessage =
      status === 403
        ? "Email or password incorrect"
        : "Something went wrong with the request. Please contact us.";
    this.setState({ errors: { ...this.state.errors, form: formMessage } });
  };

  render() {
    const { profile = {}, errors = {}, isLoading, decks } = this.state;
    const { isOpen, onClose } = this.props;
    console.log('this.state.decksInCollection, ', this.state.decksInCollection);

    return (
      <Modal
        isOpen={isOpen}
        className="loginModal"
        overlayClassName="loginModal-overlay"
        style={{
          overlay: {
            maxHeight: "100vh",
            overflowY: "auto" 
          }
        }}
      >
        <button
          className="loginModal-close btn btn-reset p-2"
          onClick={onClose}
        >
          <Octicon name="x" />
        </button>
        <div className="py-5 px-4 my-2 mx-auto" style={{ maxWidth: "400px" }}>
          <div className="text-center mx-auto">
            <h5 className="mb-1">Add Decks to Collection</h5>
            <p className="text-secondary font-weight-light">
            </p>
          </div>

          {errors.form && (
            <small className="text-danger text-uppercase ml-2 shake--error">
              {errors.form}
            </small>
          )}

          {isLoading ? (
            <h1 className="text-secondary pt-4">Loading decks...</h1>
           ) : (
            <div>
              {decks.map(deck => (
                <DeckItem
                  deck={deck}
                  key={deck._id}
                  isPinned={false}
                  onTogglePin={() => {}}
                  newCollectionPage={true}
                  isInCollection={this.isInCollection(deck._id)}
                  onToggleCollection={this.onToggleCollection}
                />
              ))}
            </div>
           )}

        </div>
      </Modal>
    );
  }
}

export default AddDeckModal;
