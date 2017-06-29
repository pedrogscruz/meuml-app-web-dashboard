angular.module('meuml.protected.migration')

.controller('MigrationController', ['$interval', '$state', 'NotificationService',
  'MigrationService', 'MigrationSearchService', 'lastMigration',

  function($interval, $state, NotificationService, MigrationService, MigrationSearchService,
           lastMigration) {

    var self = this;
    var REFRESH_LAST_MIGRATION_INTERVAL = 10000;

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
      var parameters = {
        q: {
          order_by: [{
            field: 'created_at',
            direction: 'desc',
          }],
        },
        results_per_page: 1,
      };

      MigrationSearchService.search(parameters).then(function(response) {
        if (response.result.length) {
          self.lastMigration = response.result[0];
        }
      }, function(error) {
          NotificationService.error('Não foi possível atualizar o status da correção. Tente ' +
              'novamente mais tarde', error);
        });
    };

    if (self.lastMigration) {
      $interval(self.refreshLastMigration, REFRESH_LAST_MIGRATION_INTERVAL);
    }
  }
])

;
