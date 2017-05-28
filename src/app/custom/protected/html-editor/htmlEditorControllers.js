angular.module('meuml.protected.html-editor')

.controller('HtmlEditorController', ['ImagePicker', 'SellerTemplateSearchService',
  function(ImagePicker, SellerTemplateSearchService) {
    var self = this;

    self.tinymceOptions = {
      branding: false,
      elementpath: false,
      file_picker_callback: function(callback, value, meta) {
        if (meta.filetype != 'image') {
          return;
        }

        ImagePicker.show().then(function(image) {
          var description = image.tags.map(function(imageTag) {
            return imageTag.tag;
          }).join(' ');

          callback(image.url, { alt: description });
        });
      },
      file_picker_types: 'image',
      height: 500,
      image_dimensions: false,
      language: 'pt_BR',
      language_url: '/assets/js/tinymce-language-pt_BR.js',
      menubar: 'edit insert view format table tools',
      plugins: [
        'advlist autolink save link image lists charmap preview hr anchor pagebreak searchreplace',
        'wordcount visualblocks visualchars code insertdatetime media nonbreaking table',
        'contextmenu directionality emoticons template paste textcolor',
      ],
      statusbar: false,
      toolbar1: 'undo redo | bold italic strikethrough underline | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
      toolbar2: 'image | link | table | code',
    };
  }
])

;
