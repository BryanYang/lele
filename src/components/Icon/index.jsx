import React, {PureComponent} from 'react';
import './index.scss';

export class Svg extends PureComponent {
  render() {
    const {className, glyph, ...restProps} = this.props;

    return (
      <svg className={className} {...restProps}>
        <use xlinkHref={`#${glyph}`} />
      </svg>
    );
  }
}

Svg.defaultProps = {
  glyph: '',
  className: 'icon'
};


export class Img extends PureComponent {
  render() {
    const {className, type,...restProps} = this.props;
    const data = require(`@assets/png/${type}@3x.png`)
    return (
      <img className={className} src={data} {...restProps} alt={type}/>
    );
  }
}

Img.defaultProps = {
  className: 'icon-img',
  type: 'wo',
};

