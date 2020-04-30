import React, { Component } from 'react';
import './App.css';
import Chart from './components/Chart';

class App extends Component {
  constructor(){
    super();
    this.state = {
      chartData:{},
      price: []
    }
  }

  componentWillMount(){
    this.getChartData();
  }

  getChartData = () => {
    // Ajax calls here
    const ws = new WebSocket('wss://ws-feed.pro.coinbase.com');

    let subscribe = {
      "type": "subscribe",
      "product_ids": [
          "ETH-USD",
          "ETH-EUR"
      ],
      "channels": [
          "level500",
          {
              "name": "ticker",
              "product_ids": [
                  "ETH-BTC",
                  "ETH-USD"
              ]
          }
      ]
    }

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      // console.log(response);
      this.setState({
        price: [ this.state.price, response.price],
        chartData:{
          labels: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford', this.state.price],
          datasets:[
            {
              label:'Population',
              data:[
                617594,
                181045,
                153060,
                106519,
                105162,
                95072
              ],
              backgroundColor:[
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)'
              ]
            }
          ]
        }
      });
      console.log(this.state.price); 

    };
    ws.onclose = () => {
      ws.close();
    };

  }

  render() {
    return (
      <div className="App">
        <Chart chartData={this.state.chartData} location="Massachusetts" legendPosition="bottom"/>
      </div>
    );
  }
}

export default App;
