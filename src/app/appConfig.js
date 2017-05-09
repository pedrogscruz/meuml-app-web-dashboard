angular.module('meuml')

.provider('configuration', [
  function() {
    var config = null;

    var configs = {
      development: {
        environment: 'development',
        hostnames: ['localhost'],
        apiUrl: 'http://localhost:5000/api',
        googleAnalyticsTrackingId: 'UA-93340830-2',
        html5Mode: false,
      },
      staging: {
        environment: 'staging',
        hostnames: ['app.meuml.staging.gorillascode.com'],
        apiUrl: 'https://api.meuml.staging.gorillascode.com/api',
        googleAnalyticsTrackingId: 'UA-93340830-2',
        html5Mode: true,
      }
    };

    angular.forEach(configs, function(configItem) {
      angular.forEach(configItem.hostnames, function(hostname) {
        if (window.location.hostname == hostname) {
          config = configItem;
        }
      });
    });

    if (!config) {
      throw new Error('Configuração não encontrada para o ambiente');
    }

    console.log('Configurações carregadas para: ' + config.environment);

    return {
      $get: function() {
        return config;
      }
    };
  }
])

;
