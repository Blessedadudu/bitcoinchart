import React, { Component } from 'react';
import './App.css';
import { CartesianGrid, XAxis, YAxis, AreaChart, Tooltip, Area } from 'recharts';

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
          "ETH-USD"
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
        price: [...this.state.price, response],
        
      });

    };
    ws.onclose = () => {
      ws.close();
    };

  }

  

  render() {
    return (
      <div className="App">
        <h1>Bitcoin Chart (USSD)</h1>
        <AreaChart width={1300} height={500} data={this.state.price}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="price" />
          <YAxis  />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
        </AreaChart>
      </div>
    );
  }
}

export default App;
