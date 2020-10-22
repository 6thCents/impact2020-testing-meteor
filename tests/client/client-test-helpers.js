/* global document */
// See https://guide.meteor.com/testing.html#simple-blaze-unit-test
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Tracker } from 'meteor/tracker';

if (Meteor.isClient) {

    const withDiv = (callback) => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        try {
            callback(el);
        }
        finally {
            document.body.removeChild(el);
        }
    };

    const withRenderedTemplate = (template, data, callback) => {
        withDiv((el) => {
            const ourTemplate = _.isString(template) ? Template[template] : template;
            const theView = Blaze.renderWithData(ourTemplate, data, el);
            Tracker.flush();
            callback(el, ourTemplate, theView);
        });
    };

    module.exports = withRenderedTemplate
}
