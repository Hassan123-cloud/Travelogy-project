/*
 * ===============================================================================================================
 *                                Copyright 2020-2022, Blue Yonder Group, Inc.
 *                                           All Rights Reserved
 *
 *                               THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF
 *                                          BLUE YONDER GROUP, INC.
 *
 *
 *                         The copyright notice above does not evidence any actual
 *                                 or intended publication of such source code.
 *
 * ===============================================================================================================
 */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import './i18n';

configure({ adapter: new Adapter() });

jest.mock('./auth/authProvider');
jest.mock('react-aad-msal');

window['env'] = {
  APP_PORTAL_HOST: 'http://localhost:3000',
  APP_CLIENT_ID: '4e367877-c3ed-4858-9f88-8188e5323081',
};

(HTMLCanvasElement.prototype as any).getContext = () => {
  // return whatever getContext has to return
};

window['URL'] = {
  createObjectURL: function() {},
}
const observe = jest.fn();
const unobserve = jest.fn();

// you can also pass the mock implementation
// to jest.fn as an argument
(window as any).IntersectionObserver = jest.fn(() => ({
  observe,
  unobserve,
}));

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };
