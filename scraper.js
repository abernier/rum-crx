$(window).load(function () {
  RUM.scraper.extractor.start(function (docs) {
    chrome.extension.sendMessage(docs, function(response) {
      console.log(response);
    });
  });
});