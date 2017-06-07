import React, { Component, PropTypes } from 'react';
import { remove, map } from 'lodash';
import injectContext from 'decorators/inject-context';
import classNames from 'classnames/bind';
import styles from './search.css';

const cx = classNames.bind(styles);

@injectContext
class SearchCriteria extends Component {

  state = {
    goods: [],
    criteriaText: '',
    criteriaCount: 1,
    isSearchTriggered: false
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

    console.log(data);
    flux.getActions('search').search(data, (error, response) => {
      this.setState({
        isSearchTriggered: true,
        error_data: error,
        response_data: response
      });
    });
  }

  _renderFooter = () => {
    const searchText = 'SEARCH';
    return (
      <footer className={ cx('searchFooterContainer') }>
        <span className={ cx('footer-span') }>
          <button type='button' className='btn btn-primary' onClick={ this.handleSubmit }>
            { searchText }
          </button>
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
      <div className={ cx('searchSubHeader') }>
        { headerText }
      </div>
    );
  };

  _renderSearchMessage = () => {
    const headerText = 'List of Goods that are going to be part of the deal';
    return (
      <div className={ cx('searchText') }>
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
              <input type='text' className={ cx('searchInput') } onChange={ this.handleChange } value={ criteriaVal } placeholder={ emptyText } />
            </div>
          </div>
          <div className='col-md-4'>
            <div className={ cx('searchDivider') } />
            <div>
              <span className={ cx('searchAddMore') }>
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
          <div className='col-md-12'>
            { this.state.goods.map((item, i) =>
              <span key={ i } data-id={ item.id } className={ cx('multiSelectSpan') }>
                <span>
                  { item.value }{ ' ' }
                  <a href='' onClick={ (e) => { this.handleRemove(item.id, e); } } >
                    <span className={ cx('cross') }>×</span>
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
        <div className={ cx('searchHeader') }> { this._renderTop() } </div>
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
