(function () {
  'use strict';

  angular.module('app', [])
  .controller('CalcularSimplesNacional', CalcularSimplesNacional)
  .service('AtividadesService', AtividadesService)
  .service('SimplesNacionalService', SimplesNacionalService)
  // .service('LucroPresumidoService', LucroPresumidoService)
  .constant('ApiBasePath', "https://app-dot-contabilizei-jobs.appspot.com");

  // Controller responsável pelo cálculo de imposto Simples Nacional
  CalcularSimplesNacional.$inject = ['SimplesNacionalService', 'AtividadesService'];
  function CalcularSimplesNacional(SimplesNacionalService, AtividadesService) {
    var simples = this;

    simples.fatAnterior   = 0.0;
    simples.faturamento   = 0.0;
    simples.folha         = 0.0;
    simples.codAtividade  = 0;
    simples.descAtividade = "";

    // Resolver promessa do serviço de atividades
    var promiseAtividades = AtividadesService.getAtividades();

    promiseAtividades.then(function (response) {
      simples.atividades = response.data;
      simples.descricaoAtividades = simples.atividades['objects'].map(function (o) {
        return o.descricao;
      })
    })
    .catch(function (error) {
      console.log('Oops');
    });

    // Calcular o valor total do imposto Simples Nacional
    simples.calcularImpostoSimples = function (descAtividade) {
      simples.descIndex = simples.descricaoAtividades.indexOf(descAtividade);
      simples.codAtividade = simples.atividades['objects'].map(function (c) {
        return c.cod;
      });
      simples.codAtividade = simples.codAtividade[simples.descIndex];

      // Resolver promessa do Cálculo de Simples Nacional
      var promiseSimples = SimplesNacionalService.getSimplesNacional(simples.fatAnterior, simples.faturamento, simples.folha, simples.codAtividade);

      promiseSimples.then(function (response) {
        simples.resultados = response.data;
        simples.impostoSimples = simples.resultados['objects'].map(function (r) {
          return r;
        });
        console.log(simples.impostoSimples);
      })
      .catch(function (error) {
        console.log('Oops, não pude processar os dados do Simples Nacional.');
      });
    };
  }

  // Service de requisição da lista de atividades e respectivos códigos
  AtividadesService.$inject = ['$http', 'ApiBasePath'];
  function AtividadesService($http, ApiBasePath) {
    var service = this;

    // Request de atividades
    service.getAtividades = function () {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/rest/simulador/atividades")
      });
      return response;
    };
  }

  // Service de requisição dos valores do Simples Nacional
  SimplesNacionalService.$inject = ['$http', 'ApiBasePath'];
  function SimplesNacionalService($http, ApiBasePath) {
    var service = this;

    // Request e envio de parâmetros para o serviço de cálculo do Simples Nacional
    service.getSimplesNacional = function (fatAnterior, faturamento, folha, codAtividade) {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/rest/simulador/imposto/simples"),
        params: {fatanterior: fatAnterior, faturamento: faturamento, folha: folha, codatividade: codAtividade}
      });
      return response;
    };
  }

})();
