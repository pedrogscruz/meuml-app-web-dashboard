angular.module('meuml.protected.image')

.controller('ImageListController', ['$log', '$scope', '$controller', '$state', '$stateParams',
  '$mdDialog', 'Upload', 'NotificationService', 'SellerFileService', 'UploadService',
  'SellerImageService', 'SellerImageTagService', 'SellerImageSearchService',

  function($log, $scope, $controller, $state, $stateParams, $mdDialog, Upload, NotificationService,
           SellerFileService, UploadService, SellerImageService, SellerImageTagService,
           SellerImageSearchService) {

    var self = this;

    // Filtros passados como parâmetros na URL
    self.filters = {
      tag: $stateParams.tag,
    };

    self.selectedFiles = [];
    self.selectedFilesTags = [];
    self.images = {};
    self.order = $stateParams.order;
    self.imageTags = ['celular', 'motorola'];

    $controller('PaginationController', {
      $scope: $scope,
      self: this,
      list: self.images,
      searchFunction: search
    });

    /**
     * Faz a pesquisa.
     *
     * @param paginationParameters os parâmetros da paginação.
     * @returns uma promise para a pesquisa.
     */
    function search(paginationParameters) {
      var searchParameters = createSearchParameters();
      angular.extend(searchParameters, paginationParameters);

      return SellerImageSearchService.search(searchParameters);
    }

    /**
     * Monta os parãmetros da pesquisa a partir dos parâmetros informados na URL.
     *
     * @returns os parâmetros para fazer a pesquisa.
     */
    function createSearchParameters() {
      var searchParameters = {
        q: {
          filters: [],
          order_by: [],
        },
      };

      if (self.filters.tag && self.filters.tag.length) {
        var tagsFilter = self.filters.tag.map(function(tag) {
          return {
            name: 'tags',
            op: 'any',
            val: {
              name: 'tag',
              op: '==',
              val: tag,
            }
          };
        });

        searchParameters.q.filters.push({
          and: tagsFilter
        });
      }

      if ($stateParams.order) {
        var fieldName = self.order.replace('-', '');
        var fieldDirection = (self.order[0] == '-') ? 'desc' : 'asc';

        searchParameters.q.order_by.push({
          field: fieldName,
          direction: fieldDirection
        });

        // Como vários objetos são criados ao mesmo tempo (com o mesmo "created_at") é necessário um
        // segundo campo para fazer a ordenação correta
        searchParameters.q.order_by.push({
          field: 'id',
          direction: 'asc'
        });
      }

      return searchParameters;
    }

    self.getSelectedImages = function() {
      if (self.images.result.length === 0) {
        return [];
      }

      return self.images.result.filter(function(image) {
        return image.selected;
      });
    };

    self.deleteImages = function(images, ev) {
      if (images.length === 0) {
        return;
      }

      var title = (images.length > 1) ? 'Excluir as imagens?' : 'Excluir a imagem?';
      var confirm = $mdDialog.confirm()
        .title(title)
        .textContent('Não é possível desfazer a exclusão')
        .ariaLabel(title)
        .targetEvent(ev)
        .ok('Excluir')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function() {
        var ids = images.map(function(image) {
          return image.id;
        });

        SellerImageService.deleteMultiple(ids).then(function() {
          var message = (images.length > 1) ? 'Imagens excluídas' : 'Imagem excluída';
          NotificationService.success(message);

          $state.go('.', {}, { reload: true });
        }, function(error) {
          NotificationService.error('Não foi possível excluir as imagens. Tente novamente ' +
              'mais tarde.', error);
        });
      });
    };

    self.selectFiles = function(files) {
      if (files.length === 0) {
        return;
      }

      $log.debug(files.length + ' arquivo(s) selecionado(s)');

      self.selectedFiles = self.selectedFiles.concat(files);
    };

    self.removeFileFromUpload = function(index) {
      self.selectedFiles.splice(index, 1);
    };

    self.startFilesUpload = function() {
      if (self.selectedFiles.length === 0) {
        return;
      }

      var file = self.selectedFiles[0];
      self.startFileUpload(file);
    };

    self.startFileUpload = function(file) {
      var IMAGE_MAX_WIDTH = 900;

      var filename = file.name || file.$ngfName;
      var resizedFile = null;
      var savedFile = null;

      $log.debug('Iniciando o processamento do arquivo ' + filename);

      // Redimensiona a imagem
      Upload.resize(file, {
        width: IMAGE_MAX_WIDTH,
        type: 'image/png',
        resizeIf: function(width) {
          return width > IMAGE_MAX_WIDTH;
        },
      }).then(function(response) {
        // Redimensionou a imagem então retorna as dimensões dela

        $log.debug('Arquivo ' + filename + ' redimensionado');

        resizedFile = response;
        return Upload.imageDimensions(resizedFile);
      }).then(function(dimensions) {
        // Retornou as dimensões da imagem então cria o File na API

        var fileToSave = {
          content_type: 'image/png',
          height: dimensions.height,
          original_name: filename,
          size: file.size,
          width: dimensions.width,
        };

        return SellerFileService.save({ type: 'image' }, fileToSave);
      }).then(function(response) {
        // Criou o File na API então faz o upload do arquivo

        $log.debug('File(' + response.id + ') criado para ' + filename);

        savedFile = response;
        return UploadService.upload(resizedFile, savedFile._storage);
      }).then(function() {
        var tags = self.selectedFilesTags.map(function(tag) {
          return { tag: tag };
        });

        // Fez o upload do arquivo então cria o Image na API
        var imageToSave = {
          file_id: savedFile.id,
          tags: tags,
        };

        return SellerImageService.save(imageToSave);
      }).then(function(response) {
        // Criou o Image na API
        $log.debug('Image(' + response.id + ') criado para ' + filename);
        file.image = response;
      }, function(error) {
        $log.error('Não foi possível enviar a imagem', error);
        file.error = 'Não foi possível enviar a imagem';
      }).finally(function() {
        // Busca o próximo arquivo para fazer o upload
        for (var i in self.selectedFiles) {
          var nextFile = self.selectedFiles[i];

          if (!nextFile.image && !nextFile.error) {
            self.startFileUpload(nextFile);
            return;
          }
        }


      });
    };

    self.deleteImageTag = function(tag, image, $index) {
      SellerImageTagService.delete(tag.id).then(function() {
        NotificationService.success('Tag removida');
        image.tags.splice($index, 1);
      }, function(error) {
        NotificationService.error('Não foi possível remover a tag. Tente novamente ' +
            'mais tarde.', error);
      });
    };

    self.imageUrlCopied = function() {
      NotificationService.success('Link copiado');
    };

    self.imageUrlCopyError = function(error) {
      NotificationService.error('Não foi possível copiar o link', error);
    };

    /**
     * Altera os parâmetros da URL usando os valores informados nos filtros.
     */
    self.changeFilters = function() {
      $state.go('.', {
        tag: self.filters.tag,
      });
    };

    /**
     * Altera o parâmetro de ordenação da URL.
     *
     * @param order o parãmetro usado para ordenação.
     */
    self.changeOrder = function(order) {
      $state.go('.', { order: order });
    };

    self.loadMore();
  }
])

;
