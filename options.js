function save_options() {
  var configs = [];
  $('#configs tbody tr').each(function() {
    var url = $(this).find('.url').val();
    var apiKey = $(this).find('.apiKey').val();
    var isRegex = $(this).find('.isRegex').prop('checked');
    if (url) {
      configs.push({
        url: url,
        apiKey: apiKey,
        isRegex: isRegex
      });
    }
  });

  chrome.storage.sync.set({
    configs: configs
  }, function() {
    var status = $('#status');
    status.text('Options saved.');
    status.fadeIn().delay(1000).fadeOut();
  });
}

function restore_options() {
  chrome.storage.sync.get({
    configs: []
  }, function(items) {
    var configs = items.configs;
    var tbody = $('#configs tbody');
    tbody.empty();
    configs.forEach(function(config) {
      var newRow = '<tr>' +
        '<td><input type="text" class="form-control url" value="' + config.url + '"></td>' +
        '<td><input type="text" class="form-control apiKey" value="' + config.apiKey + '"></td>' +
        '<td><input type="checkbox" class="isRegex" ' + (config.isRegex ? 'checked' : '') + '></td>' +
        '<td><button class="btn btn-danger remove">Remove</button></td>' +
        '</tr>';
      tbody.append(newRow);
    });
  });
}

function add_row() {
  var tbody = $('#configs tbody');
  var newRow = '<tr>' +
    '<td><input type="text" class="form-control url" placeholder="https://example.com/api-docs"></td>' +
    '<td><input type="text" class="form-control apiKey" placeholder="Your API Key"></td>' +
    '<td><input type="checkbox" class="isRegex"></td>' +
    '<td><button class="btn btn-danger remove">Remove</button></td>' +
    '</tr>';
  tbody.append(newRow);
}

document.addEventListener('DOMContentLoaded', restore_options);
$('#save').on('click', save_options);
$('#add').on('click', add_row);
$('#configs').on('click', '.remove', function() {
  $(this).closest('tr').remove();
});