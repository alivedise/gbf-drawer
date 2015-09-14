'use strict';

(function (exports) {
  exports.Control = React.createClass({
    displayName: "Control",

    onClick: function onClick() {},
    render: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement("button", { id: "single", onClick: this.onClick }),
        React.createElement("button", { id: "ten", onClick: this.onClick })
      );
    }
  });
})(window);