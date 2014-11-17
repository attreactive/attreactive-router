/**
 * AttrEactive Router
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var Router = require("../Router");
var $ = require("jquery");

describe('Router', function() {
  describe('getCurrentLocation', function() {
    it('should return / if url hash is empty', function() {
      window.location.hash = '';
      var router = new Router();
      expect(router.getCurrentLocation()).toEqual('/');
    });

    it('should return / if url hash is not hashbang', function() {
      window.location.hash = '#asdasd';
      var router = new Router();
      expect(router.getCurrentLocation()).toEqual('/');
    });

    it('should return url after hashbang', function() {
      window.location.hash = '#!/test/';
      var router = new Router();
      expect(router.getCurrentLocation()).toEqual('/test/');
    });

    it('should return url after hashbang only with first /', function() {
      window.location.hash = '#!test';
      var router = new Router();
      expect(router.getCurrentLocation()).toEqual('/');
    });
  });

  describe('getCurrentRouteHandler', function() {
    it('should match route handler', function() {
      var router = new Router();
      var result;

      var mainHandler = jest.genMockFn();
      mainHandler.mockReturnValue('main');
      router.add('/', mainHandler);

      var testHandler = jest.genMockFn();
      testHandler.mockReturnValue('test');
      router.add('/test/:?', testHandler);

      window.location.hash = '#!/';
      result = router.getCurrentRouteHandler();
      expect(result).not.toBeNull();
      expect(result()).toEqual('main');
      expect(mainHandler).toBeCalled();

      window.location.hash = '#!/test/1';
      result = router.getCurrentRouteHandler();
      expect(result).not.toBeNull();
      expect(result()).toEqual('test');
      expect(testHandler).toBeCalledWith('1');

      window.location.hash = '#!/404';
      result = router.getCurrentRouteHandler();
      expect(result).toBeNull();
    });
  });

  describe('addChangeListener', function() {
    it('should subscribe to hash change', function() {
      window.location.hash = '#!/';
      var listener = jest.genMockFn();
      var router = new Router();

      router.addChangeListener(listener);

      $(window).trigger('hashchange');
      expect(listener).toBeCalledWith(null);

      listener.mockClear();
      router.removeChangeListener(listener);

      $(window).trigger('hashchange');
      expect(listener).not.toBeCalled();
    });
  });
});
