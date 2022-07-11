/* eslint-disable linebreak-style */


import React from 'react';

function format(num) {
  return num != null ? num.toString() : '';
}
function unformat(str) {
  const val = parseInt(str, 10);
  return Number.isNaN(val) ? null : val;
}
export default class NumInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: format(props.value) };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    if (e.target.value.match(/^\d*$/)) {
      this.setState({ value: e.target.value });
    }
  }

  onBlur(e) {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(e, unformat(value));
  }

  render() {
    const { value } = this.state;
    return (
      <input
        type="text"
        {...this.props}
        value={value}
        onBlur={this.onBlur}
        onChange={this.onChange}
      />
    );
  }
}


/*
If you set the input’s type as a number, you find that (a) it behaves differently on
different browsers, (b) masking does not work on some browsers, and (c) when
it does allow invalid characters, you don’t see them in onChange. This is because
as per the HTML specification, when the type is specified and the input does
not conform to the specification, the value of the input is supposed to return
an empty string. It is also up to the browser how to deal with invalid values; for
example, some browsers may display the fact that the input is invalid, whereas
others may prevent an invalid entry.
When using React, it is best not to use the type attribute of input fields, instead
it’s best to deal with the validation or masking yourself (or use packages that do it
for you). This lets the behavior be predictable across browsers, as well as allows
you to make informed decisions on what to do with invalid input, especially
input that is invalid temporarily in order to get to a valid value.
*/
