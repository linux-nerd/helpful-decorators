import { timeout, debounce, throttle, once, memoize } from '../src';
jest.mock('lodash.debounce');
jest.mock('lodash.throttle');
import * as throttleFn from 'lodash.throttle';
import * as debounceFn from 'lodash.debounce';
jest.useFakeTimers();


describe('Decorators', () => {
  describe('timeout', function () {
    class Test {
      @timeout(1000)
      method() {
        console.log('Worked');
      }
    }

    it('should call setTimeout', function () {
      new Test().method();
      expect(setTimeout['mock'].calls.length).toBe(1);
      expect(setTimeout['mock'].calls[0][1]).toBe(1000);
    });

    it('should invoke the console.log', function () {
      const spy = jest.spyOn(console, 'log');
      new Test().method();
      jest.runAllTimers();
      expect(spy).toBeCalled()
      expect(spy).toHaveBeenCalledWith('Worked');
    });
  });

  describe('debounce', function () {
    const func = function () {
      return 'called';
    }
    debounceFn['mockImplementation'](function () {
      return func;
    });
    class TestDebounce {
      @debounce(3000)
      method() {
        console.log('Debounce Worked!');
      }
    }
    it('should call debounce', function () {
      new TestDebounce().method();
      expect(debounceFn).toBeCalled();
      expect(debounceFn['mock'].calls[0][1]).toEqual(3000);
      expect(debounceFn['mock'].calls[0][2]).toEqual({});
    });
  })

  describe('throttle', function () {
    const func = function () {
      return 'called';
    }
    throttleFn['mockImplementation'](function () {
      return func;
    });
    class TestThrottle {
      @throttle(3000)
      method() {
        console.log('Throttle Worked!');
      }
    }
    it('should call throttle', function () {
      new TestThrottle().method();
      expect(debounceFn).toBeCalled();
      expect(debounceFn['mock'].calls[0][1]).toEqual(3000);
      expect(debounceFn['mock'].calls[0][2]).toEqual({});
    });
  });

  describe('once', function () {
    class TestOnce {
      @once
      method() {
        console.warn('Once Worked!');
      }
    }
    it('should call the method only once', function () {
      const instance = new TestOnce();
      const consoleSpy = jest.spyOn(console, 'warn');
      instance.method();
      instance.method();
      instance.method();
      expect(consoleSpy).toBeCalled();
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Memoization', () => {
    class TestMemoization {
      @memoize
      method(n) {
        return n + 10;
      }
    }
    let obj: TestMemoization;
    beforeEach(() => {
      obj = new TestMemoization;
      // obj.method(4);
    });
    it('should calculate the result and when invoked again, should fetch from the cache', () => {
      spyOn(console, 'log').and.callThrough();
      obj.method(3);
      expect(console.log).toHaveBeenCalledWith('Calculating Result');
      obj.method(3);
      expect(console.log).toHaveBeenCalledWith('Fetching From Cache');
    });
  });
});