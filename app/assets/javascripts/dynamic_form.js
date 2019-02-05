function DynamicForm(options) {
  this.options = options;

  this.refresh = function(url) {
    console.log("refreshing to url: " + url);
    Page.refresh({url: url, onlyKeys: [this.options.dom_id], updatePushState: false})
  };

  this.update_page = function() {
    var self = this;
    var focusedElement;
    console.log("change");
    setTimeout(function() {
      var url = self.options.refresh_path + "?" +
        "form_id=" + self.options.form_id + "&" +
        $("#" + self.options.dom_id + " form").serialize()
      if (self.options.form_object_id !== null) {
        url = url + "&form_object_id=" + self.options.form_object_id;
      }
      focusedElement = document.activeElement;
      if (focusedElement.nodeName === "INPUT" && focusedElement.type !== "checkbox") {
        self.focusedElementId = focusedElement.dom_id
        self.selectionStart = focusedElement.selectionStart;
        self.selectionEnd = focusedElement.selectionEnd;
        self.selectionDirection = focusedElement.selectionDirection;
      }
      else {
        self.focusedElementId = null;
      }

      self.refresh(url);
    }, 1);
  };

  this.add_event_handlers = function() {
    var self = this;
    $(this.selector + " input[data-refresh-on='change']").each(function (index, elem) {
      $(elem).on("change", function() { self.update_page() });
    });
  };

  this.initialize = function() {
    console.log("-- DynamicForm: options -------------");
    console.log(options);
    console.log("--------------------------------------");
    var self = this;

    this.selector = "#" + this.options.dom_id;
    this.focusedElementId = null;
    this.selectionStart = null;
    this.selectionEnd = null;
    this.selectionDirection = null;

    this.add_event_handlers();

    document.addEventListener('page:load', function(event) {
      self.add_event_handlers();
      if (self.focusedElementId != null) {
        var elem = document.getElementById(self.focusedElementId);
        elem.focus();
        if (elem.type !== "checkbox") {
          elem.setSelectionRange(self.selectionStart, self.selectionEnd, self.selectionDirection)
       }
      }
    });

    document.addEventListener('page:after-node-removed', function(event) {
      console.log("node removed");
      $(event.data).remove()
    })
  }
}