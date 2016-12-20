(function () {
  'use strict';

  angular.module('app', [])
  .controller('ListarAtividades', ListarAtividades)
  .service('AtividadesService', AtividadesService)
  .constant('ApiBasePath', "https://app-dot-contabilizei-jobs.appspot.com");

  ListarAtividades.$inject = ['AtividadesService'];
  function ListarAtividades(AtividadesService) {
    var lista = this;

    var promise = AtividadesService.getAtividades();

    promise.then(function (response) {
      lista.atividades = response.data;
      lista.descricaoAtividades = lista.atividades['objects'].map(function (o) {
        return o.descricao;
      })
    })
    .catch(function (error) {
      console.log('Oops');
    });
  }

  AtividadesService.$inject = ['$http', 'ApiBasePath'];
  function AtividadesService($http, ApiBasePath) {
    var service = this;

    service.getAtividades = function () {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/rest/simulador/atividades")
      });
      return response;
    };
  }

})();
