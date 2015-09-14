'use strict';

(function (exports) {
  exports.App = React.createClass({
    displayName: "App",

    getInitialState: function getInitialState() {
      this.stores = [];
      return {
        money: 0,
        results: [],
        newResult: [],
        SSR_SCORE: 97,
        SR_SCORE: 82
      };
    },
    onChange: function onChange() {
      this.setState({
        SSR_SCORE: this.refs.god.value ? 94 : 97
      });
    },
    componentDidMount: function componentDidMount() {
      for (var id in window.GachaList) {
        this.stores.push(window.GachaList[id]);
      }

      $("[name='my-checkbox']").bootstrapSwitch();
    },
    componentDidUpdate: function componentDidUpdate() {
      $("[name='my-checkbox']").bootstrapSwitch();
    },
    getRandom: function getRandom(rarity) {
      var item;
      do {
        item = this.stores[Math.floor(Math.random() * this.stores.length)];
      } while (item && item.rarity !== rarity);
      return item;
    },
    draw: function draw(time) {
      var result = [];
      for (var i = 0; i < time; i++) {
        var score = Math.ceil(Math.random() * 100);
        if (score > this.state.SSR_SCORE) {
          result.push(this.getRandom('ssr'));
        } else if (score > this.state.SR_SCORE) {
          result.push(this.getRandom('sr'));
        } else {
          result.push(this.getRandom('r'));
        }
      }
      return result;
    },
    drawTen: function drawTen() {
      var money = this.state.money;
      var results = this.state.results;
      var newResult = this.draw(10);
      this.setState({
        money: money + 3000,
        results: results.concat(newResult),
        newResult: newResult
      });
    },
    drawSingle: function drawSingle() {
      var money = this.state.money;
      var results = this.state.results;
      var newResult = this.draw(1);
      this.setState({
        money: money + 300,
        results: results.concat(newResult),
        newResult: newResult
      });
    },
    onClick: function onClick(evt) {
      switch (evt.target.id) {
        case 'ten':
          this.drawTen();
          break;
        case 'single':
          this.drawSingle();
          break;
        case 'clear':
          this.setState({
            newResult: [],
            results: [],
            money: 0
          });
          break;
      }
    },
    getPercentage: function getPercentage(count) {
      return this.state.results.length ? (100 * count / this.state.results.length).toFixed(2) + '%' : '0%';
    },
    render: function render() {
      var ssr = 0;
      var sr = 0;
      var r = 0;
      var resultDOM = this.state.newResult.map(function (item) {
        var character = '';
        if (window.GachaList[item.id].character_img) {
          character = React.createElement("img", { className: "character", src: window.GachaList[item.id].character_img });
        }
        return React.createElement(
          "div",
          { className: "col-lg-3 col-md-4 col-xs-6 thumb" },
          React.createElement("img", { src: window.GachaList[item.id].img }),
          character
        );
      });
      if (resultDOM.length) {
        resultDOM = React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "row" },
            resultDOM
          )
        );
      }
      var totalDOM = this.state.results.map(function (item) {
        if (item.rarity === 'ssr') {
          ssr++;
        } else if (item.rarity === 'sr') {
          sr++;
        } else {
          r++;
        }
        return React.createElement(
          "div",
          { className: "thumb col-md-1" },
          React.createElement("img", { src: window.GachaList[item.id].img })
        );
      });
      if (totalDOM.length) {
        totalDOM = React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "row" },
            totalDOM
          )
        );
      }
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { key: "control" },
          React.createElement(
            "div",
            { className: "row" },
            React.createElement(
              "label",
              null,
              "神祭"
            ),
            React.createElement("input", { ref: "god", type: "checkbox", name: "my-checkbox", onChange: this.onChange })
          ),
          React.createElement(
            "div",
            { className: "row" },
            React.createElement(
              "button",
              { className: "btn btn-info", id: "single", onClick: this.onClick },
              "單抽"
            ),
            React.createElement(
              "button",
              { className: "btn btn-info", id: "ten", onClick: this.onClick },
              "十抽"
            ),
            React.createElement(
              "button",
              { className: "btn btn-warning", id: "clear", onClick: this.onClick },
              "重來"
            )
          )
        ),
        React.createElement(
          "div",
          { id: "result", ref: "result", key: "result" },
          resultDOM
        ),
        React.createElement(
          "h3",
          null,
          "累計: ",
          this.state.money,
          " [SSR: ",
          ssr,
          "(",
          this.getPercentage(ssr),
          ") ,SR: ",
          sr,
          "(",
          this.getPercentage(sr),
          "), R: ",
          r,
          "(",
          this.getPercentage(r),
          ")]"
        ),
        React.createElement(
          "div",
          { id: "total", key: "total", ref: "total" },
          totalDOM
        )
      );
    }
  });
})(window);