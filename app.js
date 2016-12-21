(function () {
  'use strict';

  angular.module('app', [])
  .controller('CalcularSimplesNacional', CalcularSimplesNacional)
  .controller('CalcularLucroPresumido', CalcularLucroPresumido)
  .service('AtividadesService', AtividadesService)
  .service('SimplesNacionalService', SimplesNacionalService)
  .service('LucroPresumidoService', LucroPresumidoService)
  .constant('ApiBasePath', "https://app-dot-contabilizei-jobs.appspot.com");

  // Controller responsável pelo cálculo de imposto Simples Nacional
  CalcularSimplesNacional.$inject = ['SimplesNacionalService', 'AtividadesService'];
  function CalcularSimplesNacional(SimplesNacionalService, AtividadesService) {
    var simples = this;

    simples.fatAnterior;
    simples.faturamento;
    simples.folha;
    simples.codAtividade;
    simples.descAtividade;

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

  // Controller responsável em calcular imposto de Lucro Presumido
  CalcularLucroPresumido.$inject = ['LucroPresumidoService'];
  function CalcularLucroPresumido(LucroPresumidoService) {
    var lucro = this;

    lucro.faturamento;
    lucro.folha;

    // Calcular valor total do Lucro Presumido
    lucro.calcularImpostoLucro = function () {
      var promiseLucro = LucroPresumidoService.getLucroPresumido(lucro.faturamento, lucro.folha);

      promiseLucro.then(function (response) {
        lucro.resultados = response.data;
        lucro.impostoLucro = lucro.resultados['objects'].map(function (r) {
          return r;
        });
        console.log(lucro.impostoLucro);
      })
      .catch(function (error) {
        console.log('Oops, não pude processar os dados do Lucro Presumido.');
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

  // Service de requisição dos valores do Lucro Presumido
  LucroPresumidoService.$inject = ['$http', 'ApiBasePath'];
  function LucroPresumidoService($http, ApiBasePath) {
    var service = this;

    // Request e envio de parâmetros para o serviço de cálculo do Lucro Presumido
    service.getLucroPresumido = function (faturamento, folha) {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/rest/simulador/imposto/lucropresumido"),
        params: {faturamento: faturamento, folha: folha}
      });
      return response;
    }
  }

})();
