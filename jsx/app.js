'use strict';

(function(exports) {
  exports.App = React.createClass({
    getInitialState: function() {
      this.stores = [];
      return {
        money: 0,
        results: [],
        newResult: [],
        SSR_SCORE: 97,
        SR_SCORE: 82
      }
    },
    onChange: function() {
      this.setState({
        SSR_SCORE: this.refs.god.value ? 94 : 97
      });
    },
    componentDidMount: function() {
      for (var id in window.GachaList) {
        this.stores.push(window.GachaList[id]);
      }

      $("[name='my-checkbox']").bootstrapSwitch();
    },
    componentDidUpdate: function() {
      $("[name='my-checkbox']").bootstrapSwitch();
    },
    getRandom: function(rarity) {
      var item;
      do {
        item = this.stores[Math.floor(Math.random()*this.stores.length)];
      } while (item && item.rarity !== rarity);
      return item;
    },
    draw: function(time) {
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
    drawTen: function() {
      var money = this.state.money;
      var results = this.state.results;
      var newResult = this.draw(10);
      this.setState({
        money: money + 3000,
        results: results.concat(newResult),
        newResult: newResult
      });
    },
    drawSingle: function() {
      var money = this.state.money;
      var results = this.state.results;
      var newResult = this.draw(1);
      this.setState({
        money: money + 300,
        results: results.concat(newResult),
        newResult: newResult
      });
    },
    onClick: function(evt) {
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
    getPercentage: function(count) {
      return this.state.results.length ? (100*count/(this.state.results.length)).toFixed(2) + '%' : '0%'
    },
    render: function() {
      var ssr = 0;
      var sr = 0;
      var r = 0;
      var resultDOM = this.state.newResult.map(function(item) {
        var character = '';
        if (window.GachaList[item.id].character_img) {
          character = <img className="character" src={window.GachaList[item.id].character_img} />;
        }
        return <div className="col-lg-3 col-md-4 col-xs-6 thumb">
                <img src={window.GachaList[item.id].img} />
                {character}
               </div>
      });
      if (resultDOM.length) {
        resultDOM = <div className="container"><div className="row">{resultDOM}</div></div>
      }
      var totalDOM = this.state.results.map(function(item) {
        if (item.rarity === 'ssr') {
          ssr++;
        } else if (item.rarity === 'sr') {
          sr++;
        } else {
          r++;
        }
        return <div className="thumb col-md-1"><img src={window.GachaList[item.id].img}></img></div>
      });
      if (totalDOM.length) {
        totalDOM = <div className="container"><div className="row">{totalDOM}</div></div>
      }
      return <div>
                <div key="control">
                  <div className="row">
                    <label>神祭</label>
                    <input ref="god" type="checkbox" name="my-checkbox" onChange={this.onChange} />
                  </div>
                  <div className="row">
                    <button className="btn btn-info" id="single" onClick={this.onClick}>單抽</button>
                    <button className="btn btn-info"  id="ten" onClick={this.onClick}>十抽</button>
                    <button className="btn btn-warning"  id="clear" onClick={this.onClick}>重來</button>
                  </div>
                </div>
                <div id="result" ref="result" key="result">
                  {resultDOM}
                </div>
                <h3>累計: {this.state.money} [SSR: {ssr}({this.getPercentage(ssr)}) ,SR: {sr}({this.getPercentage(sr)}), R: {r}({this.getPercentage(r)})]</h3>
                <div id="total" key="total" ref="total">
                  {totalDOM}
                </div>
             </div>
    }
  });
}(window));
