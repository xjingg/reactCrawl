import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { message } from 'antd';
import ReactEcharts from 'echarts-for-react';
import request from '../../request';
import moment from 'moment';
import './style.css';

interface CaseItem {
  title: string;
  count: number;
}

interface DataStructure {
  [key: string]: CaseItem[];
}

interface State {
  loaded: boolean;
  isLogin: boolean;
  data: DataStructure;
}

class Home extends Component {
  state: State = {
    loaded: false,
    isLogin: true,
    data: {}
  };

  componentDidMount() {
    request.get('/api/isLogin').then(res => {
      const data: boolean = res.data;
      if (!data) {
        this.setState({
          isLogin: false,
          loaded: true
        });
      } else {
        this.setState({
          loaded: true
        });
      }
    });

    request.get('/api/showData').then(res => {
      const data = res.data;
      console.log(data,"data")
      if (data) {
        this.setState({ data });
      }
    });
  }

  handleLogoutClick = () => {
    request.get('/api/logout').then(res => {
      const data: DataStructure = res.data;
      if (data) {
        this.setState({
          isLogin: false
        });
      } else {
        message.error('Logout fail');
      }
    });
  };

  handleCrawlClick = () => {
    request.get('/api/getData').then(res => {
      const data: boolean = res.data;
      console.log(data)
      if (data) {
        message.success('successful crawl');
      } else {
        message.error('logout failed');
      }
    });
  };

  //mapping data to charts
  getOption: () => echarts.EChartOption = () => {
    const { data } = this.state;
    const caseNames: string[] = [];
    const times: string[] = [];
    const tempData: {
      [key: string]: number[];
    } = {};
    for (let i in data) {
      const item = data[i];
      times.push(moment(Number(i)).format('MM-DD HH:mm'));
      item.forEach(innerItem => {
        const { title, count } = innerItem;
        if (caseNames.indexOf(title) === -1) {
          caseNames.push(title);
        }
        tempData[title] ? tempData[title].push(count) : (tempData[title] = [count]);
      });
    }
    const result: echarts.EChartOption.Series[] = [];
    for (let i in tempData) {
      result.push({
        name: i,
        type: 'line',
        data: tempData[i],
      });
    }
    return {
      title: {
        text: 'COVID-19 Case Tracker',
        textStyle: {
          color: "#ffffff",
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: caseNames,
        icon: "circle",
        x: "center",
        textStyle: {
        color: "#fff",
        fontSize: 18
    }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times,
        axisLabel:{
        color:"#ffffff"
        }
        
      },
      yAxis: {
        type: 'value',
        axisLabel:{
          color:"#ffffff"
          }
      },
      series: result,
    };
  };

  render() {
    const { isLogin, loaded } = this.state;
    const style={
      fontSize: "20px",
      height: "50vh",
    }
    if (isLogin) {
      if (loaded) {
        return (
          <div className="home-page">
          
            <ReactEcharts option={this.getOption()} style={style} />
            <p>(Note: data crawled from CDC website, death data in March might not that accurate.)</p>
            <div className="buttons">
              <button className="btn" onClick={this.handleCrawlClick}>
                Crawl
              </button>
              <button className="btn" onClick={this.handleLogoutClick}>
                Logout
              </button>
            </div>
          </div>
        );
      }
      return null;
    }
    return <Redirect to="/login" />;
  }
}

export default Home;
