var couch = new RUM.scraper.Couch('http://localhost:5984/rum');

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    var newDocs = request;
    //console.log(newDocs);

    if (newDocs.length < 1) {
      return;
    }

    //
    // 1- Merge new docs with old ones
    //

    couch.mergeWithOldDocs(newDocs).done(function (mergedDocs) {
      //console.log(mergedDocs);

      //
      // 2- Store merged docs
      //

      couch.store(mergedDocs).done(function (data) {
        //console.log('stored!', this, arguments);

        sendResponse(data);
      });
    });

    return true;
  }
);

