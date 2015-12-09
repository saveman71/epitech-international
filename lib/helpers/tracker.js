'use strict';

var Mixpanel = require('mixpanel');

var config = require('../../config/index.js');

var mixpanelClient = null;
if (config.mixpanelApiKey) {
  mixpanelClient = Mixpanel.init(config.mixpanelApiKey);
}

module.exports.track = function(req, event, props) {
  if(!mixpanelClient) {
    return;
  }

  if(!props) {
    props = {};
  }

  props.distinct_id = req.session._id.toString();
  props.userId = req.session._id.toString();
  props.login = req.session.login;
  props.gpa = req.session.gpa;
  props.$ip = req.ip;

  mixpanelClient.track(event, props);
};

module.exports.set = function(user, props) {
  if(!mixpanelClient) {
    return;
  }

  mixpanelClient.people.set(user._id.toString(), props);
};

module.exports.increment = function(user, props) {
  if(!mixpanelClient) {
    return;
  }

  mixpanelClient.people.increment(user._id.toString(), props);
};
