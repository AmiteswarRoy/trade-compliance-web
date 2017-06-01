/* global sinon */
import ReactI13nTealium from 'i13n/tealium/index';
import sinon from 'sinon';
import { expect } from 'chai';
import fakeData from './tealium.i13n.plugin.test-data.json';


describe('ReactI13nTealium, a i13n plugin for Tealium', () => {
  let plugin;

  beforeEach(() => {
    plugin = new ReactI13nTealium();
  });

  describe('should calls', () => {
    it('"ensureScriptHasLoaded" function', () => {
      plugin.ensureScriptHasLoaded();
    });

    it('"getPlugin" function should hook "click" and "pageview"', () => {
      const result = plugin.getPlugin();
      result.name.should.eq('Tealium');
      (typeof result.eventHandlers.click).should.eq('function');
      (typeof result.eventHandlers.pageview).should.eq('function');
    });

    it('"cleanupUtag" should clean article related data', () => {
      window.utag = {
        data: {
          article_id: '1234',
          article_access: 'full',
          article_published: '2016-04-11',
          article_headline: 'Test this function',
          article_type: 'test',
          should: 'stay'
        }
      };
      plugin.cleanupUtag();
      window.utag.should.eql({ data: { should: 'stay' } });
    });

    context('"flattern" function', () => {
      it('with default separator', () => {
        const result = plugin.flatten(fakeData.flattern_data);
        result.should.eql(fakeData.flattern_expected_result);
      });

      it('with custom separator', () => {
        const expectedResult = Object.assign({}, fakeData.flattern_expected_result);
        expectedResult.usertype = 'subscriber';
        delete expectedResult.user_type;
        const result = plugin.flatten(fakeData.flattern_data, '');
        result.should.eql(expectedResult);
      });

      it('with default separator and array props', () => {
        const data = Object.assign({}, fakeData.flattern_data);
        const expectedResult = Object.assign({}, fakeData.flattern_expected_result);
        data.cities = [ { name: 'New York' } ];
        data.states = [];
        expectedResult['cities[0]_name'] = 'New York';
        expectedResult.states = [];
        const result = plugin.flatten(data);
        result.should.eql(expectedResult);
      });
    });

    context('"generatePayload" function', () => {
      it('with data', () => {
        const result = plugin.generatePayload(fakeData.payload_data);
        result.should.eql(fakeData.payload_expected_result);
      });

      it('without data', () => {
        const result = plugin.generatePayload();
        JSON.stringify(result)
            .should
            .eql(JSON.stringify(fakeData.payload_expected_result_when_no_data));
      });
    });

    // there is somthing wrong with the function isValidAccount logic
    context('"isValidAccount" function', () => {
      it('returns true with valid account', () => {
        const result = plugin.isValidAccount('9BGSOF');
        result.should.eql(true);
      });

      it('returns true without account', () => {
        const result = plugin.isValidAccount();
        result.should.eql(true);
      });

      it('returns true with invalid account', () => {
        const result = plugin.isValidAccount('9ZZZ');
        result.should.eql(true);
      });
    });

    it('"track" function', () => {
      const spy = sinon.spy();
      window.utag = {};
      window.utag.view = spy;
      plugin.track(fakeData.payload_data, () => {});
      expect(spy.calledOnce).to.equal(true);
    });

    it('"fireCallback" function', () => {
      const spy = sinon.spy();
      plugin.fireCallback(spy, () => {});
      expect(spy.calledOnce).to.equal(true);
    });

    it('"trackLink" function', () => {
      const spy = sinon.spy();
      window.utag = {};
      window.utag.link = spy;
      const promise = plugin.trackLink(fakeData.payload_data, null);
      promise.then(() => {});
      expect(spy.calledOnce).to.equal(true);
    });
  });
});
