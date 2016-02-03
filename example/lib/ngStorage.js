/**
 * Angular Storage Module
 */
angular.module('ngStorage', [])

  .service('$localStorage', _buildStorage(window.localStorage))

  .service('$sessionStorage', _buildStorage(window.sessionStorage))

  function _buildStorage(storage) {

    return function() {

      var toJson = angular.toJson;
      var fromJson = angular.fromJson;

      var service = {
        getItem: _getItem,
        setItem: _setItem,
        removeItem: _removeItem,
        getObject: _getObject,
        setObject: _setObject,
      }

      return service;

      function _setItem(key, val) {
        return storage.setItem(key, val)
      }

      function _getItem(key) {
        return storage.getItem(key)
      }

      function _removeItem(key) {
        return storage.removeItem(key)
      }

      function _getObject(key) {
        return fromJson(storage.getItem(key))
      }
      
      function _setObject(key, val) {
        return storage.setItem(key, toJson(val))
      }


    }

  }
