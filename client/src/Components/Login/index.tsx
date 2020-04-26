import React, { Component } from 'react';
import request from '../../request';
import qs from 'qs';
import { Form, Icon, Input, Button, message } from 'antd';
import { Redirect } from 'react-router-dom';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import './style.css';

interface FormFields {
  password: string;
}

interface Props {
  form: WrappedFormUtils<FormFields>;
}

class LoginForm extends Component<Props> {
  state = {
    isLogin: false
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        request
          .post(
            '/api/login',
            qs.stringify({
              password: values.password
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          )
          .then(res => {
            const data: boolean = res.data;
            if (data) {
              this.setState({
                isLogin: true
              });
            } else {
              message.error('login failed');
            }
          });
      }
    });
  };

  render() {
    const { isLogin } = this.state;
    const { getFieldDecorator } = this.props.form;
    return isLogin ? (
      <Redirect to="/" />
    ) : (
      <div className="login-home">
        <h1>Please Login Here</h1>
      <div className="login-page">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'please type in password' }]
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />
            )}
            <p>( Password: test )</p>
          </Form.Item>
          <Form.Item>
            <Button className="btn" htmlType="submit">
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
      </div>
    );
  }
}

const WrappedLoginForm = Form.create({
  name: 'login'
})(LoginForm);

export default WrappedLoginForm;
