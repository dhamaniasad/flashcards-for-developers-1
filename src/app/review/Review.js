import React, { Component } from "react";
import moment from "moment";
import cookie from "js-cookie";
import PropTypes from "prop-types";

import isAuthenticated from "../utils/isAuthenticated";
import UpgradeModal from "../auth/UpgradeModal";
import isProMember from "../utils/isProMember";

import * as api from "../apiActions";
import * as localStorage from "../utils/localStorage";
import * as studyProgress from "../utils/studyProgress";
import * as analytics from "../../components/GoogleAnalytics";

import Tab from "../../components/Tab";
import CardsSection from "./CardsSection";
import SettingsSection from "./SettingsSection";
import StudySection from "./StudySection";
import ReviewHeader from "./ReviewHeader";

const TABS = {
  STUDY: "study",
  CARDS: "cards",
  SETTINGS: "settings",
};

class Review extends Component {
  static defaultProps = { match: { params: {} } };

  state = {
    deck: {},
    cards: [],
    activeTab: TABS.STUDY,
    isDeckLoading: true,
    isCardsLoading: true,
    isError: false,
    cardProgress: [],
  };

  // Lifecycle methods
  componentWillMount() {
    this.context.mixpanel.track("Reviewing.");
    console.log(this.props);

    const { params } = this.props.match;
    if (params.tabName && params.tabName.length > 0) {
      this.setState({ activeTab: params.tabName });
    }
  }

  componentDidMount() {
    const { params } = this.props.match;
    console.log(params);
    if (this.isCollectionPage()) {
      this.fetchCollection(params.collectionId);
      this.fetchMixedCards(params.collectionId);
      this.fetchStudyProgress();
    } else {
      this.fetchDeck(parseInt(params.deckId));
      this.fetchDeckProgress(parseInt(params.deckId));
    }
  }

  // Event Listeners
  onUpdateDeck = deck => this.setState({ deck: deck });

  onDeleteDeck = () => this.props.history.push("/");

  onAddCard = card => this.setState({ cards: [...this.state.cards, card] });

  onTabSelect = value => {
    const { deckId } = this.props.match.params;
    this.props.history.push(`/decks/${deckId}/${value}`);
    this.setState({ activeTab: value });
  };

  onSRSToggle = value => {
    analytics.logToggleFamiliarCards(value);
    this.setState({ isCardsLoading: true }, () => {
      if (this.isCollectionPage()) {
        const { collectionId } = this.props.match.params;
        this.fetchMixedCards(collectionId);
      } else {
        const { deckId } = this.props.match.params;
        this.fetchCards(parseInt(deckId));
      }
    });
  };

  // API helper methods
  fetchDeck = deckId => {
    api.fetchDeck(deckId).then(
      ({ data }) => {
        // TODO: Set the name on the server-side
        document.title = data.name
          ? `${data.name} | Flashcards for Developers`
          : "Flashcards for Developers";
        this.setState({ deck: data, isDeckLoading: false }, () => this.fetchCards(data._id));
      },
      error => this.setState({ isError: true, isDeckLoading: false }),
    );
  };

  fetchCollection = collectionId => {
    if (this.isPinnedCollection()) {
      this.setState({
        deck: {
          name: "My Pinned Decks",
          type: "Self graded",
          description: "A collection of my all-time favorite decks that I want to learn.",
        },
        isDeckLoading: false,
      });
    } else {
      api
        .fetchCollection(collectionId)
        .then(({ data }) => {
          this.setState({ deck: { ...data, type: "Self graded" }, isDeckLoading: false });
        })
        .catch(error => this.setState({ isError: true, isCardsLoading: false }));
    }
  };

  fetchCards = deckId => {
    api
      .fetchCards({ deck: deckId })
      .then(this.handleCardsResponse)
      .catch(this.handleError);
  };

  fetchMixedCards = collectionId => {
    // Edge case: fetching a set of mixed cards from a set of pinned decks.
    const params =
      !isAuthenticated() && this.isPinnedCollection()
        ? { deckIds: localStorage.getPinnedDecks() }
        : { collection: collectionId };

    api
      .fetchCards(params)
      .then(this.handleCardsResponse)
      .catch(this.handleError);
  };

  fetchDeckProgress = deckId => {
    if (isAuthenticated()) {
      api
        .fetchDeckStudyProgress(deckId)
        .then(({ data }) => this.setState({ cardProgress: data.cards || [] }))
        .catch(this.handleError);
    } else {
      const deckProgress = localStorage.getDeckProgressObject(deckId) || {};
      this.setState({ cardProgress: deckProgress.cards || [] });
    }
  };

  fetchStudyProgress = () => {
    if (isAuthenticated()) {
      api
        .fetchStudyProgress()
        .then(({ data }) => {
          const cardProgress = data.reduce((acc, el) => [...acc, ...el.cards], []);
          this.setState({ cardProgress });
        })
        .catch(this.handleError);
    } else {
      const studyProgress = localStorage.getStudyProgress();
      const cardProgress = studyProgress.reduce((acc, el) => [...acc, ...el.cards], []);
      this.setState({ cardProgress });
    }
  };

  handleCardsResponse = ({ data }) => {
    console.log(data)
    // const { index } = this.state;
    this.setState({ cards: data, index: 0, isCardsLoading: false });
  };

  setStudyProgress = (card, isCorrect) => {
    const deckId = card.deck.id || card.deck;
    const cardObj = this.state.cardProgress.find(el => el.card === card._id) || {};
    const { reviewedAt, leitnerBox } = studyProgress.calcUpdatedLevel(cardObj, isCorrect);

    if (isAuthenticated()) {
      api
        .addCardProgress(deckId, card._id, leitnerBox, reviewedAt)
        .then(({ data }) => this.setState({ cardProgress: data.cards }))
        .catch(this.handleError);
    } else {
      const deckProgress = localStorage.addCardProgress(deckId, card._id, leitnerBox, reviewedAt);
      this.setState({ cardProgress: deckProgress.cards });
    }
  };

  setStudySession = () => {
    const currentDate = moment().startOf("day");

    if (isAuthenticated()) {
      api.addStudySession(currentDate).catch(this.handleError);
    } else {
      localStorage.addStudySession(currentDate);
    }
  };

  handleError = error => {
    console.error(error);
    this.setState({ isError: true, isCardsLoading: false, isDeckLoading: false });
  };

  // State helper methods
  isPinnedCollection = () => this.props.match.params.collectionId === "pinned";
  isCollectionPage = () => this.props.match.path === "/collections/:collectionId/review";
  isDeckOwner = () => {
    const { deck } = this.state;
    const user = isAuthenticated() ? JSON.parse(cookie.get("user")) : {};
    return isAuthenticated() && deck.author === user._id;
  };

  render() {
    const { deck, activeTab, isDeckLoading, isError } = this.state;

    if (isDeckLoading) {
      return (
        <div className="container container--narrow px-0">
          <div className="p-4 text-center w-100">
            <h5 className="text-secondary">
              <i className="fas fa-spinner fa-spin mr-1" />
              Loading deck...
            </h5>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="container container--narrow px-0">
          <div className="text-center p-4">
            <h1 className="text-dark">Unable to load request</h1>
            <p>Please try again or go back home.</p>
          </div>
        </div>
      );
    }

    const showUpgradeModal = Boolean(deck) && deck.pro && !isProMember();

    return (
      <div>
        <UpgradeModal isOpen={false} title="Unlock this deck with Flashcards Pro" />
        <div
          className="review-header pt-4"
          style={{ background: "#f9f9f9", borderBottom: "1px solid #e8e8e8" }}
        >
          <div className="container container--narrow">
            {Object.keys(deck).length > 0 && (
              <ReviewHeader deck={deck} className="review-header mt-3 mb-2" />
            )}

            <div className="d-flex mt-3">
              <Tab onClick={() => this.onTabSelect(TABS.STUDY)} active={activeTab === TABS.STUDY}>
                Study
              </Tab>
              <Tab onClick={() => this.onTabSelect(TABS.CARDS)} active={activeTab === TABS.CARDS}>
                Cards ({this.state.cards.length})
              </Tab>
              {this.isDeckOwner() && (
                <Tab
                  onClick={() => this.onTabSelect(TABS.SETTINGS)}
                  active={activeTab === TABS.SETTINGS}
                >
                  Settings
                </Tab>
              )}
            </div>
          </div>
        </div>

        {activeTab === TABS.STUDY && (
          <div className="container container--narrow py-4">
            <StudySection
              deck={deck}
              cards={this.state.cards}
              cardProgress={this.state.cardProgress}
              onUpdateSession={this.setStudySession}
              onUpdateProgress={this.setStudyProgress}
              onSRSToggle={this.onSRSToggle}
              isLoading={this.state.isCardsLoading}
            />
          </div>
        )}
        {activeTab === TABS.CARDS &&
          !this.state.isCardsLoading && (
            <div className="container container--narrow py-4">
              <CardsSection
                deck={this.state.deck}
                cards={this.state.cards}
                onAddCard={this.onAddCard}
              />
            </div>
          )}
        {activeTab === TABS.SETTINGS &&
          this.isDeckOwner() &&
          !this.state.isDeckLoading && (
            <div className="container container--narrow py-4">
              <SettingsSection
                deck={this.state.deck}
                onUpdateDeck={this.onUpdateDeck}
                onDeleteDeck={this.onDeleteDeck}
              />
            </div>
          )}
      </div>
    );
  }
}

Review.contextTypes = {
  mixpanel: PropTypes.object.isRequired,
};
export default Review;
