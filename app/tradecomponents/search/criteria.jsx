import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { remove, map } from 'lodash';

class SearchCriteria extends Component {

  state = {
    goods: [],
    criteriaText: '',
    criteriaCount: 1
  };

  handleChange = (e) => {
    this.setState({
      criteriaText: e.target.value
    });
  }

  static contextTypes = {
    flux: PropTypes.object.isRequired
  }

  handleAddMore = (e) => {
    e.preventDefault();
    if (this.state.criteriaText !== '') {
      const newInput = {
        id: this.state.criteriaCount,
        value: this.state.criteriaText
      };
      const newGoods = this.state.goods;
      newGoods.push(newInput);
      this.state.criteriaCount += 1;
      this.setState({
        criteriaText: '',
        goods: newGoods
      });
    } else {
      alert('Error TBD');
    }
  }

  handleRemove = (id, e) => {
    e.preventDefault();
    const items = remove(this.state.goods, (element) => {
      const isMatched = element.id !== id;
      return isMatched;
    });
    this.setState({
      goods: items
    });
  }

  handleSubmit = () => {
    const { flux } = this.context;
    const data = {
      goods: map(this.state.goods, 'value')
    };
    this.setState({
      isSearchTriggered: true
    });
    console.log(data);
    flux.getActions('search').search(data);
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
    const emptyText = 'Name of the good';
    const criteriaVal = this.state.criteriaText;
    return (
      <div>
        <div className='row'>
          <div className='col-md-4'>
            <div>
              { headerText }
            </div>
            <div>
              <input type='text' className='searchInput' onChange={ this.handleChange } value={ criteriaVal } placeholder={ emptyText } />
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
        </div>
        <br />
        <div className='row'>
          <div>
            { this.state.goods.map((item, i) =>
              <span key={ i } data-id={ item.id } >
                <span>
                  { item.value }{ ' ' }
                  <a href='' onClick={ (e) => { this.handleRemove(item.id, e); } } >
                    <span className='glyphicon glyphicon-minus-sign searchAddMoreIcon' />
                  </a>
                </span>
              </span>
            ) }
          </div>
        </div>
      </div>
    );
  };

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
