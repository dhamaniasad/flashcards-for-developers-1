import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Pages from "../pages/Pages";
import Home from "./home/Home";
import Review from "./review/Review";
import DecksNew from "./decks/DecksNew";
import CollectionsHome from "./collections/CollectionsHome";
import Collections from "./collections/Collections";
import Logout from "./auth/Logout";
import AuthRedirect from "./auth/AuthRedirect";
import Profile from "./profile/Profile";
import Settings from "./settings/Settings";
import ReqAuth from "./auth/ReqAuth";
import ReqUser from "./auth/ReqUser";
import ReqUsername from "./auth/ReqUsername";
import Footer from "./Footer";
import Header from "./Header";

import NotFound from "../components/NotFound";
import GoogleAnalytics from "../components/GoogleAnalytics";
import ScrollToTop from "../components/ScrollToTop";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App d-flex flex-column justify-content-between text-left">
          <Header />
          <div className="d-flex flex-column" style={{ flexGrow: 1 }}>
            <Route path="/" component={GoogleAnalytics} />
            <Route path="/" component={ScrollToTop} />
            <Route path="/" component={ReqUsername} />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/pages" component={Pages} />
              <Route path="/logout" component={Logout} />
              <Route path="/auth/github" component={AuthRedirect} />
              <Route exact path="/decks/new" component={ReqAuth(DecksNew)} />
              <Route exact path="/decks/:deckId(\d+)" component={Review} />
              <Route exact path="/decks/:deckId(\d+)/:tabName" component={Review} />
              <Route exact path="/collections" component={CollectionsHome} />
              <Route exact path="/collections/:collectionId" component={Collections} />
              <Route exact path="/collections/:collectionId/review" component={Review} />
              <Route exact path="/settings/profile" component={Settings} />
              <Route exact path="/:username" component={ReqUser(Profile)} />
              <Route exact path="/:username/:tabName" component={ReqUser(Profile)} />
              <Route exact path="*" component={NotFound} />
            </Switch>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
