import React, { Component } from 'react';
import $ from "jquery";

import Navigation from './navigation.js'

import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    //this.state = {states: [], city: '', state: ''};
    this.state ={
      city: '', states: [], state: '', temp: '', desc: '', icon: '', cod: '', message: ''
    };

    // preserve the initial state in a new object
    this.baseState = this.state;
  }

  componentDidMount() {
    this.GetStates();
  }

  GetStates = () => {
    $.ajax({
      url: 'https://backend-weatherapp.herokuapp.com/states',
      type: "GET",
      dataType: "json",
      crossDomain: true,
      contentType:"application/json;charset=utf-8",
      cache: false,
      success: receivedResults => {
        //console.log("feteched data successfully");
        this.setState({states: receivedResults});
      },
      error: (xhr, status, err) => {
        console.error("Failed to fetch data");
      }
    })
    // fetch('https://backend-weatherapp.herokuapp.com/states')
    // .then(res => res.json())
    // .then(states => this.setState({states}));
  }

  handleChange = (e) => {
    this.setState({city: e.target.value});
  }
  handleStateChange = (e) => {
    this.setState({state: e.target.value});
  }

  handleSubmit = (event) => {
    this.setState({cod: '', temp: ''});
    //alert('A name was submitted: ' + this.state.city + ', ' + this.state.state);
    //console.log(this.state.city);
    event.preventDefault();
    $.ajax({
      url: 'https://backend-weatherapp.herokuapp.com/weather',
      type: 'post',
      data: {city: this.state.city},
      dataType: 'json',
      success: searchResults => {
        //console.log("Fetched data successfully");
        // console.log(searchResults)
        const results = searchResults;
        // console.log(results);
        // console.log(results.weather[0].description);
        // console.log(results.weather[0].icon);
        // console.log(Math.floor(results.main.temp));
        if(results.cod === "400")
        {
          this.setState({ cod: results.cod, message: results.message});
        }else if(results.cod==="404") {
          this.setState({cod: results.cod, message: results.message});
        }
        else {
          this.setState({ temp: Math.floor(results.main.temp), desc: results.weather[0].description, icon: results.weather[0].icon });
        }
      },
      error: (xhr, status, err) => {
        console.error("Failed to fetch data");
      }
    });
    // fetch('/weather')
    // .then(res => res.json())
    // .then(weather => this.setState({weather}));
  }

  ResetState = (ev) => {
    ev.preventDefault();
    this.setState(this.baseState);
    this.GetStates();
    //alert("Hello, World!");
  }

  render() {
    var html = '';
    if(this.state.temp !==undefined && this.state.temp !== "" && this.state.temp !== null) {
      // console.log(this.state.temp)
      html = (
<div className="row justify-content-center">
                    <div className="col my-5">
                      <p> It is {this.state.temp} degrees in {this.state.city},{this.state.state} and {this.state.desc}</p>
                    </div>
          </div>
      ) 
    }else if(this.state.cod === "400" ){
      html = (
        <div className="row justify-content-center">
                    <div className="col my-5">
                      <p> There was an error fetching the weather information, please check that you entered a city and state.</p>
                    </div>
          </div>
      )
    }else if (this.state.cod ==="404"){
      html = (
        <div className="row justify-content-center">
                    <div className="col my-5">
                      <p> {this.state.message}</p>
                    </div>
          </div>
      )
    }
    else {
      html = '';
    }
    return (
      <div>
        <Navigation />
        <div className="container">
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-md-4">
                <label>City</label>
                  <input type="text" value={this.state.city} onChange={this.handleChange} className="form-control" placeholder="City"/>
                </div>
                <div className="col">
                <div className="form-group col-md-4">
                  <label>State</label>
                  <select value={this.state.state} onChange={this.handleStateChange} name="state" className="form-control">
                  <option>Choose State...</option>
                  {this.state.states.map(state => 
                      <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
                      )}
                  </select>
                </div>
                </div>
              </div>
              <input type="submit" value="Get Weather" className="btn btn-primary"/>
              <button className="btn btn-warning mx-2" onClick={this.ResetState}>Reset State!</button>
          </form>
          {html}
        </div>
        
      </div>
    );
  }
}

export default App;
