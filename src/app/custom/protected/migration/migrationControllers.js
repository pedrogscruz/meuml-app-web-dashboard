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
              'tarde.');
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
              'tarde.', error);
          $state.go('.', {}, { reload: true });
        });
      });
    };

    self.refreshLastMigration = function() {
      MigrationSearchService.getLastMigration().then(function(lastMigration) {
        self.lastMigration = lastMigration;

        if (self.lastMigration && self.lastMigration.status == 'ERROR') {
          stopMigrationTimer();
        }
      }, function(error) {
        NotificationService.error('Não foi possível atualizar o status da correção. Tente ' +
            'novamente mais tarde', error);
        stopMigrationTimer();
      });
    };

    if (self.lastMigration && self.lastMigration.status != 'ERROR') {
      lastMigrationTimer = $interval(self.refreshLastMigration, REFRESH_LAST_MIGRATION_INTERVAL);
    }

    function stopMigrationTimer() {
      if (lastMigrationTimer) {
        $interval.cancel(lastMigrationTimer);
        lastMigrationTimer = null;
      }
    }

    $scope.$on('$destroy', function() {
      stopMigrationTimer();
    });
  }
])

;
