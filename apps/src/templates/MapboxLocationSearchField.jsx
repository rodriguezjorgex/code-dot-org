import {AddressAutofill} from '@mapbox/search-js-react';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import i18n from '@cdo/locale';
/**
 * A search box that loads a Mapbox location search control.
 *
 */
export class MapboxLocationSearchField extends React.Component {
  static propTypes = {
    mapboxAccessToken: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
  };

  render() {
    // Container for the search input.
    let searchBox = (
      <AddressAutofill accessToken={this.props.mapboxAccessToken}>
        <input
          type="text"
          style={this.props.style}
          className={this.props.className}
          value={this.props.value}
          disabled={this.props.readOnly}
          onChange={this.props.onChange}
          autoComplete="street-address"
          placeholder={
            this.props.placeholder || i18n.schoolLocationSearchPlaceholder()
          }
        />
      </AddressAutofill>
    );

    // If the input is just readonly, render a disabled <input> instead of the Mapbox search box.
    if (this.props.readOnly || !this.props.mapboxAccessToken) {
      searchBox = (
        <input
          type={'text'}
          style={this.props.style}
          className={`${this.props.className} readOnly`}
          value={this.props.value}
          disabled={this.props.readOnly}
          onChange={this.props.onChange}
        />
      );
    }
    return <div id="mapbox-location-search-container">{searchBox}</div>;
  }
}

export default connect(state => ({
  mapboxAccessToken: state.mapbox.mapboxAccessToken,
}))(MapboxLocationSearchField);
