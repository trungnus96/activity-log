import React, { Component } from 'react';
import './main-layout.scss';
import $ from 'jquery';
import { Input, Button, Icon, Row, Col, Pagination, Spin, Select, Popconfirm, message } from 'antd';
import axios from 'axios';

const backend_endpoint = process.env.REACT_APP_BACKEND_ENDPOINT ? process.env.REACT_APP_BACKEND_ENDPOINT : '';

export default class MainLayout extends Component {

  constructor(props){
    super(props);

    this.state = {
      showForm: false,
      initial_values: '',
      total: 0,
      current_page: 1,
      activity_log: [],
      isLoading: true,
      pageSize: 10
    }
  }

  componentDidMount(){
    this.fetchActiviLog(10, 1);
  }

  fetchActiviLog = (limit, page_number) => {
    this.setState({
      isLoading: true,
    })
    axios.post(backend_endpoint + "/activity_log/get", {
      data: {
        limit,
        page_number
      }
    }).then(res => {
      if(res.status >= 200 && res.status < 300 && res.data.success){
        const { data: { total, data } } = res;
        this.setState({
          activity_log: data,
          total,
          isLoading: false
        })
      }else{
        const msg = res.data && res.data.error_msg ? res.data.error_msg : 'Unknown error';
        alert(msg);
      }
    })

  }

  onShowSizeChange = (current, pageSize) => {
    this.setState({
      current_page: 1,
      pageSize
    });
    this.fetchActiviLog(pageSize, 1);
  }

  onPageChange = (page, pageSize) => {
    this.setState({
      current_page: page,
      pageSize
    });
    this.fetchActiviLog(pageSize, page);
  }

  showForm = () => {
    this.setState({
      showForm: true,
    })
  }

  closeForm = () => {
    this.setState({
      initial_values: '',
      showForm: false,
    })

    this.fetchActiviLog();
  }

  showEditForm = (activty) => {
    this.setState({
      initial_values: activty,
      showForm: true,
    })
  }

  render() {
    return (
      <div className="main-layout">
        {!this.state.showForm ?
          <div className="dashboard">

            <Button className="add-btn" onClick={this.showForm}><Icon type="plus" /></Button>
            <h3>Your activity log</h3>
            {this.state.isLoading ?
              <Spin />
              :
              <div>
                {!this.state.isLoading && this.state.activity_log.length === 0 &&
                  <p>You don't have any activity log</p>
                }
                <div className="pagination">
                  {!this.state.isLoading && this.state.activity_log.length !== 0 &&  <Pagination size="small" defaultCurrent={1} current={this.state.current_page} total={this.state.total} pageSize={this.state.pageSize} showSizeChanger onShowSizeChange={this.onShowSizeChange} onChange={this.onPageChange}/>}
                </div>
                {this.state.activity_log.map((a,i) =>
                  <div key={i} className="activity">
                    <Icon type="edit" className="edit-btn" onClick={_ => this.showEditForm(a)}/>
                    <h4>ID: {a.activity_log_id}</h4>
                    <p>Date & Time: {a.date_time}</p>
                    <p>Description: {a.description}</p>
                    <p>Tags: {a.tags.map((t,i) => <span key={i} className="tag">{t}</span>)}</p>
                    <p>Location: {a.location}</p>
                  </div>
                )}
                <div className="pagination">
                  {!this.state.isLoading && this.state.activity_log.length !== 0 &&  <Pagination size="small" defaultCurrent={1} current={this.state.current_page} total={this.state.total} pageSize={this.state.pageSize} showSizeChanger onShowSizeChange={this.onShowSizeChange} onChange={this.onPageChange}/>}
                </div>
              </div>
            }
          </div>
          :
          <Form closeForm={this.closeForm} initial_values={this.state.initial_values}/>
        }
      </div>
    );
  }
}

class Form extends Component {
  constructor(props){
    super(props);

    this.state = {
      activity_log_id: '',
      date_time: '',
      description: '',
      tags: [],
      location: 'Getting...',
      isLoading: false,
    }
  }

  componentDidMount(){

    if(this.props.initial_values !== ''){
      const { activity_log_id, date_time, description, location, tags } = this.props.initial_values;
      this.setState({ activity_log_id, date_time, description, location, tags });
    }else{
      this.setState({
        activity_log_id: (new Date).getTime()
      });

      this.getAccurateCurrentLocation();
    }
  }

  onChangeInputField = (value) => {
    this.setState({
      description: value
    })
  }

  onSelectChange = (values) => {
    this.setState({
      tags: [ ...values ]
    })
  }

  onSubmit = () => {
    this.setState({
      isLoading: true
    })
    let { activity_log_id, date_time, description, tags, location } = this.state;
    location = location === 'Getting...' ? 'No location' : location;
    const activity_log = {
      activity_log_id: Number(activity_log_id),
      date_time, description, tags, location
    }
    const url = this.props.initial_values === '' ? '/activity_log/save' : '/activity_log/update';
    axios.post(backend_endpoint + url, {
      data: {
        activity_log
      }
    }).then(res => {
      if(res.status >= 200 && res.status < 300 && res.data.success){
        this.setState({
          isLoading: false
        });
        message.success(res.data.message);
        this.props.closeForm();
      }else{
        const msg = res.data && res.data.error_msg ? res.data.error_msg : 'Unknown error';
        this.setState({
          isLoading: false
        })
        message.error(msg);
      }
    })
  }

  onRemove = () => {
    this.setState({
      isLoading: true
    })
    let { activity_log_id } = this.state;
    const url = '/activity_log/remove';
    axios.post(backend_endpoint + url, {
      data: {
        activity_log_id
      }
    }).then(res => {
      if(res.status >= 200 && res.status < 300 && res.data.success){
        this.setState({
          isLoading: false
        });
        message.success(res.data.message);
        this.props.closeForm();
      }else{
        const msg = res.data && res.data.error_msg ? res.data.error_msg : 'Unknown error';
        this.setState({
          isLoading: false
        })
        message.error(msg);
      }
    })
  }

  getCurrentDateTime = () => {
    var currentdate = new Date();
    var date_time = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
    this.setState({
      date_time
    })
  }

  getAccurateCurrentLocation = () => {
    this.setState({
      location: 'Getting...',
    })
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {

        let { coords: { latitude, longitude } } = position;


        $.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude)
        .then(res => {
          if(res.status === 'OK'){
            const places = res.results;
            const street_address = places[0].formatted_address;

            this.setState({
              location: street_address
            })
          }else{

          }
        })
      });
    }
  }

  render(){
    return(
      <div className="form">
        {this.props.initial_values !== '' &&
          <div className="delete-btn">
            <Popconfirm title="Are you sure delete this activity log?" onConfirm={this.onRemove} onCancel={_ => {}} okText="Yes" cancelText="No">
              <Icon type="delete" style={{ fontSize: 16}}/>
            </Popconfirm>
          </div>
        }
        <h3>{this.props.initial_values === '' ? 'Add a new': 'Update the'} activity</h3>
        <label htmlFor="">ID</label>
        <Input placeholder="ID" value={this.state.activity_log_id} readOnly/>
        <br/><br/>
        <label htmlFor="">Date & Time</label>
        <Row gutter={32}>
          <Col span={16}>
            <Input placeholder="Date & Time" value={this.state.date_time} readOnly/>
          </Col>
          <Col span={8}>
            {this.props.initial_values === '' && <Button onClick={this.getCurrentDateTime}><Icon type="clock-circle-o" /></Button>}
          </Col>
        </Row>
        <br/>
        <label htmlFor="">Description</label>
        <Input placeholder="Description" value={this.state.description} onChange={e => this.onChangeInputField(e.target.value)}/>
        <br/><br/>
        <label htmlFor="">Tags</label>
        <Select
           mode="tags"
           style={{ width: '100%' }}
           onChange={this.onSelectChange}
           tokenSeparators={[',']}
           value={this.state.tags}
         />
        <br/><br/>
        <label htmlFor="">Location <Icon type="sync" onClick={this.getAccurateCurrentLocation}/></label>
        <p>{this.state.location}</p>
        <div className="button">
          <Button className="cancel-btn" disabled={this.state.isLoading} onClick={this.props.closeForm}>Cancel</Button>
          <Button type="primary" onClick={this.onSubmit} disabled={this.state.isLoading}>
            {this.state.isLoading ?
              <Icon type="loading" />
              :
              <span>Save</span>
            }
          </Button>
        </div>
      </div>
    );
  }
}
