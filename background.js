//console.log('background.js')

var db = Pouch('rum');
db.allDocs({include_docs: true}, function(err, response) {
  console.log('all docs', response);
});

function setBadge() {
  db.allDocs(function(err, response) {
    chrome.browserAction.setBadgeText({text: ''+response.total_rows || '0'});
  });
}
setBadge();

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    var newDocs = request;
    console.log('extracted docs', newDocs);

    if (newDocs.length < 1) {
      return;
    }

    //
    // 1- Fetch old docs matching new ones
    //

    var newDocsIds = newDocs.map(function (newDoc) {return newDoc.id});
    db.allDocs({keys: newDocsIds, include_docs: true}, function(err, response) {
      if (err) {
        console.log(err);
        return;
      }

      var oldDocs = response;

      //
      // 2- Merge new docs with properties of old ones
      //

      newDocs.forEach(function (newDoc, i) {
        newDocs[i]['_id'] = newDoc.id;

        // Find corresponding old doc
        var oldDoc = _(oldDocs).find(function (oldDoc) {return oldDoc.id === newDoc.id;});

        if (!oldDoc) {
          return;
        }

        // by reference
        newDocs[i] = $.extend(true, {}, oldDoc, newDoc);
      });

      console.log('newDocs', newDocs)

      // save
      db.bulkDocs({docs: newDocs}, function(err, response) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('newDocs saved!', response);

        setBadge();
      });

    });

    return true;
  }
);

