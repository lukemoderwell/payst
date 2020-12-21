/*
Paste text selection
*/
function getSelectedText() {
  var text = "";
  if (typeof window.getSelection != "undefined") {
    text = window.getSelection().toString();
  } else if (
    typeof document.selection != "undefined" &&
    document.selection.type == "Text"
  ) {
    text = document.selection.createRange().text;
  }
  return text;
}

function pasteLink(e) {
  if (e.metaKey && e.key === "v") {
    // and if text is selected
    var selectedText = getSelectedText();
    if (selectedText.length > 0) {
      // and if pasted text is a link
      navigator.permissions.query({ name: "clipboard-read" }).then(result => {
        // If permission to read the clipboard is granted or if the user will
        // be prompted to allow it, we proceed.
        if (result.state == "granted" || result.state == "prompt") {
          navigator.clipboard.readText().then(data => {
            // check that data is either an image or url
            var imageRe = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
            var urlRe = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
            var link;
            var textarea = window.getSelection().focusNode.parentElement.getElementsByTagName('textarea')[0];
            if (imageRe.test(data)) {
              link = '![' + selectedText +'](' + data + ')';
              // select entire range & set link
              textarea.setSelectionRange(0,-1);
              textarea.setRangeText(link);      
              textarea.blur();
            } else if (urlRe.test(data)) {
              link = '[' + selectedText +'](' + data + ')';
              // select entire range & set link
              textarea.setSelectionRange(0,-1);
              textarea.setRangeText(link);      
              textarea.blur();
            }
          });
        } else {
          console.log('Clipboard access denied.');
        }
      })
    }
  }
}

window.addEventListener("keydown", pasteLink);
