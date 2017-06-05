import React, { Component, PropTypes } from 'react';
import { bindAll, remove } from 'lodash';
import { Button } from 'react-bootstrap';

class SearchCriteria extends Component {
  constructor() {
    super();
    this.state = {
      goods: [],
      value: ''
    };
    bindAll(this, '_renderTop', '_renderHeader', '_renderSearchMessage', '_renderCriteria', '_renderFooter', 'handleChange', 'handleRemove', 'handleAddMore', 'handleSubmit');
  }

  static contextTypes = {
    flux: PropTypes.object.isRequired
  }

  _renderTop = () => {
    const headerText = 'Details of Transaction';
    return (
      <span>
        { headerText }
      </span>
    );
  };

  _renderHeader = () => {
    const headerText = 'DESCRIPTION OF GOODS';
    return (
      <div className='searchSubHeader'>
        { headerText }
      </div>
    );
  };

  _renderSearchMessage = () => {
    const headerText = 'List of Goods that are going to be part of the deal';
    return (
      <div className='searchText'>
        { headerText }
      </div>
    );
  };

  _renderCriteria = () => {
    const headerText = 'Name of the Good';
    const addMoreText = 'Add More Goods ';
    return (
      <div className='row'>
        <div className='col-md-4'>
          <div>
            { headerText }
          </div>
          <div>
            <input placeholder='Name of the Good' className='searchInput' onBlur={ this.handleChange } type='text' defaultValue={ this.state.value } />
          </div>
        </div>
        <div className='col-md-4'>
          <div className='searchDivider' />
          <div>
            <span className='searchAddMore'>
              { addMoreText }
            </span>
            <a href='' onClick={ this.handleAddMore } >
              <span className='glyphicon glyphicon-plus-sign searchAddMoreIcon' />
            </a>
          </div>
        </div>
        <div>
          { this.state.goods.map((item, i) =>
            <div key={ i } data-id={ item.id } >
              { item.value }
              <a href='' onClick={ () => this.handleRemove(item.id) } >
                <span className='glyphicon glyphicon-minus-sign searchAddMoreIcon' />
              </a>
            </div>
          ) }
        </div>
      </div>
    );
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  handleAddMore = (e) => {
    e.preventDefault();
    if (this.state.value !== '') {
      const newInput = {
        id: this.state.goods.length,
        value: this.state.value
      };
      this.state.goods.push(newInput);
      this.setState({ value: '' });
    } else {
      alert('TODO ERROR TEXT');
    }
  }

  handleRemove = (id) => {
    const items = remove(this.state.goods, (el) => { id !== el.id; });
    this.setState({
      goods: items
    });
  }

  _renderFooter = () => {
    const searchText = 'Search';
    return (
      <footer className='searchFooterContainer'>
        <span className='footer-span'>
          <Button bsStyle='primary' bsSize='small' onClick={ this.handleSubmit }>
            { searchText }
          </Button>
        </span>
      </footer>
    );
  };

  handleSubmit = () => {
    const { flux } = this.context;
    const data = {
      goods: this.state.goods
    };
    this.setState({
      isSearchTriggered: true
    });
    flux.getActions('search').search(data);
  }

  render() {
    return (
      <div>
        <div className='searchHeader'> { this._renderTop() } </div>
        <div className='container-fluid'>
          { this._renderHeader() }
          { this._renderSearchMessage() }
          { this._renderCriteria() }
          { this._renderFooter() }
        </div>
      </div>
    );
  }
}

export default SearchCriteria;
