import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import * as api from "../apiActions";
import Octicon from "../../components/Octicon";
import isProMember from "../utils/isProMember";
import { SliderPicker } from 'react-color';

class DecksNew extends Component {
  state = { name: "", description: "", deck: {}, isRedirect: false, emoji: "", color: "#b3cee6" };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  handleColorChangeComplete = (color, event) => {
    this.setState({ color: color.hex });
  };

  onSubmit = e => {
    e.preventDefault();
    const { name, description, emoji, color } = this.state;

    if (isProMember()) {
      api
        .createCollection({ name, description, emoji, color })
        .then(response => this.setState({ isRedirect: true, collection: response.data }))
        // .catch(error => console.log(error));
    }
  };

  render() {
    const { name, description, deck, isRedirect, emoji, color, collection } = this.state;

    if (isRedirect && Object.keys(collection).length > 0) {
      return <Redirect to={`/collections/${collection._id}`} />;
    }

    return (
      <div>
        {!isProMember() && (
          <div className="alert alert-info text-center rounded-0">
            <div className="container container--full px-4">
              <i className="fas fa-lock mr-2" />
              Upgrade your account to create your own collections.{" "}
              <Link className="alert-link text-underline" to="/pages/membership">
                Unlock private collections
              </Link>
              .
            </div>
          </div>
        )}

        <div className="container container--narrow py-5">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="mb-4">
                <h1 className="m-0">Create a new collection</h1>
                <p className="deck-description p-0">
                  A collection is a set of decks related to a particular theme, eg: JavaScript or Python.
                  You'll be able to add decks to the collection after creation.
                </p>
                <hr />
              </div>
              <form onSubmit={this.onSubmit}>
                <div className="form-group mb-4">
                  <label className="small font-weight-bold mb-1">Enter a collection name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder={`e.g. "For JavaScript Developers"`}
                    onChange={this.onChange}
                    value={name}
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="small font-weight-bold mb-1">
                    Enter a collection description <span className="text-muted">(optional)</span>
                  </label>
                  <textarea
                    type="text"
                    name="description"
                    className="form-control"
                    placeholder={`e.g. "Topics for developers who focus on interactive web applications."`}
                    onChange={this.onChange}
                    value={description}
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="small font-weight-bold mb-1">
                    Choose a collection emoji
                    &nbsp; &nbsp; [ ⌃ + ⌘ + Spacebar on Mac ]
                  </label>
                  <p>
                    <span className="text-muted">
                      <a href="https://emojipedia.org/unicode-10.0/" target="_blank">
                        You can also copy emojis from this link
                      </a>
                    </span>
                  </p>
                  <input
                    type="text"
                    name="emoji"
                    className="form-control"
                    placeholder={`✨`}
                    onChange={this.onChange}
                    value={emoji}
                    required={true}
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="small font-weight-bold mb-1">
                    Choose a collection color
                  </label>
                  <div className="pt-3">
                    <SliderPicker styles={{ default: { wrap: {} } }} color={color} onChange={this.handleColorChangeComplete} />
                  </div>
                  <input
                    type="text"
                    name="color"
                    className="form-control"
                    placeholder={`#`}
                    value={color}
                    required={true}
                    readOnly={true}
                  />
                </div>
                <button
                  className="btn btn-dark btn-sm font-weight-medium py-2 w-100"
                  type="submit"
                  disabled={!isProMember()}
                >
                  Create Collection
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DecksNew;
