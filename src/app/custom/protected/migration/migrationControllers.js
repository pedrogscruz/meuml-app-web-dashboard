angular.module('meuml.protected.migration')

.controller('MigrationController', ['$scope', '$interval', '$state', 'NotificationService',
  'MigrationService', 'MigrationSearchService', 'lastMigration',

  function($scope, $interval, $state, NotificationService, MigrationService, MigrationSearchService,
           lastMigration) {

    var self = this;

    // Timer para verificar o status da última migração
    var lastMigrationTimer = null;

    // Intervalo de verificação do status da última migração (em milisegundos)
    var REFRESH_LAST_MIGRATION_INTERVAL = 15000;

    self.lastMigration = lastMigration;

    self.start = function(type) {
      MELI.login(function() {
        var token = MELI.getToken();

        if (!token) {
          NotificationService.error('Não foi possível recuperar o token. Tente novamente mais ' +
              'tarde');
          return;
        }

        var migration = {
          data: {
            access_token: token,
          },
          type: type,
        };

        MigrationService.save(migration).then(function() {
          $state.go('.', {}, { reload: true });
        }, function(error) {
          NotificationService.error('Não foi possível começar a correção. Tente novamente mais ' +
              'tarde', error);
        });
      });
    };

    self.refreshLastMigration = function() {
      MigrationSearchService.getLastMigration().then(function(lastMigration) {
        self.lastMigration = lastMigration;
      }, function(error) {
        NotificationService.error('Não foi possível atualizar o status da correção. Tente ' +
            'novamente mais tarde', error);
      });
    };

    if (self.lastMigration) {
      lastMigrationTimer = $interval(self.refreshLastMigration, REFRESH_LAST_MIGRATION_INTERVAL);
    }

    $scope.$on('$destroy', function() {
      // Finaliza o timer
      if (lastMigrationTimer) {
        $interval.cancel(lastMigrationTimer);
        lastMigrationTimer = null;
      }
    });
  }
])

;
