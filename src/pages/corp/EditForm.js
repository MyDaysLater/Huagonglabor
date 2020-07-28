import React, { Component } from 'react';
import { Form } from 'antd';
import { withRouter } from 'react-router-dom';
class EditForm extends Component {
  render() {
    return (
      <div>
        
      </div>
    )
  }
}

export default Form.create({ name: 'editCorpForm' })(withRouter(EditForm));