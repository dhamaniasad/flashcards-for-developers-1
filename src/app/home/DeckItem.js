import React, { Component } from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import * as utils from "../utils/studyProgress";
import ProgressBar from "../../components/ProgressBar";
import Octicon from "../../components/Octicon";

import isProMember from "../utils/isProMember";
import UpgradeModal from "../auth/UpgradeModal";

import * as analytics from "../../components/GoogleAnalytics";

class DeckItem extends Component {
  state = { showUpgradeModal: false };

  onOpenUpgradeModal = e => {
    e.preventDefault();
    this.setState({ showUpgradeModal: true });
  };

  onCloseUpgradeModal = () => {
    analytics.logProAction("User exited upgrade modal from 'Deck Item'");
    this.setState({ showUpgradeModal: false });
  };

  onClick = e => {
    if (this.props.deck.pro && !isProMember()) {
      e.preventDefault();
      this.onOpenUpgradeModal(e);
    } else if (this.props.deck.pro && isProMember()) {
      analytics.logProAction("User successfully clicked a 'Pro' level deck button");
    }
  };

  pinDeckContainer = (label) => {
    return (
      <button
        className={cx("pin-btn badge align-items-center p-0", {
          "pin-btn-active": this.props.isPinned,
        })}
        onClick={e => this.props.onTogglePin(e, this.props.deck)}
      >
        <Octicon
          name="pin"
          className="d-flex align-items-center ml-1 "
          width={13}
          height={13}
        />
        <span className="text-uppercase pr-1 py-1 m-0" style={{ paddingLeft: "1px" }}>
          {label}
        </span>
      </button>
    )
  };

  addToCollectionContainer = (label) => {
    return (
      <button
        className={cx("pin-btn badge align-items-center p-0 coll-btn", {
          "coll-btn-remove": this.props.isInCollection
        })}
        onClick={e => this.props.onToggleCollection(e, this.props.deck)}
      >
        <Octicon
          name="plus"
          className="d-flex align-items-center ml-1 color-white"
          width={13}
          height={13}
        />
        <span className="text-uppercase pr-1 py-1 m-0" style={{ paddingLeft: "1px" }}>
          {label}
        </span>
      </button>
    )
  }

  render() {
    const progress = utils.calcStudyProgress(this.props.deck, this.props.deckProgress);
    const proficiency = utils.calcStudyProficiency(this.props.deckProgress);
    const label = this.props.isPinned ? "Pinned" : "Pin";
    const isNewCollectionPage = this.props.newCollectionPage;
    const collectionLabel = this.props.isInCollection ? "Remove From Collection" : "Add To Collection";

    let cardClasses = isNewCollectionPage ? "" : "col-12 col-sm-6 col-md-4 col-lg-3";

    return (
      <div className={`deck-item col-12 ${cardClasses} d-flex`}>
        <UpgradeModal isOpen={this.state.showUpgradeModal} onClose={this.onCloseUpgradeModal} />

        <Link
          onClick={this.onClick}
          to={isNewCollectionPage ? "#" : `/decks/${this.props.deck._id}`}
          className="border border-dark bg-white rounded d-flex flex-column justify-content-between text-dark mb-3 p-4 w-100 position-relative"
          style={{ fontSize: "14px" }}
        >
          <div>
            <ProgressBar className="mb-2" progress={progress} proficiency={proficiency} />
            {this.props.deck.name}
            {!isNewCollectionPage && this.pinDeckContainer(label)}
            {isNewCollectionPage && this.addToCollectionContainer(collectionLabel)}
            <div
              className="position-absolute d-flex align-items-center"
              style={{ bottom: "16px", right: "18px" }}
            >
              {this.props.deck.status === "private" && (
                <div className="text-muted small ml-1 p-0">
                  <div className="text-uppercase p-1">Private</div>
                </div>
              )}
              {this.props.deck.new && (
                <div className="badge badge-primary ml-1 p-0">
                  <div className="text-uppercase p-1">New</div>
                </div>
              )}
              {this.props.deck.pro && (
                <div className="badge badge-warning ml-1 d-flex align-items-center p-0">
                  <Octicon
                    name="star"
                    className="d-flex align-items-center ml-1"
                    width={13}
                    height={13}
                  />
                  <span className="text-uppercase pr-1 py-1 m-0" style={{ paddingLeft: "1px" }}>
                    Pro
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

DeckItem.defaultProps = {
  deck: {},
};

export default DeckItem;
