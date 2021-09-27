import React from 'react';
import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Icon = ({ size, color, className, align, text, ...props }) => (
  <Element
    {...props}
    className={classnames('icon', className, {
      [`is-${size}`]: size,
      [`is-${align}`]: align,
      [`has-text-${color}`]: color,
    })}
  />
);

// Icon.propTypes = {
//   size: PropTypes.oneOfType([
//     PropTypes.oneOf(['small', 'medium', 'large']),
//     PropTypes.string,
//   ]),
//   /**
//    * Used when the icon is inside a `Form.Control`
//    */
//   align: PropTypes.oneOf(['left', 'right']),
//   color: PropTypes.oneOfType([
//     PropTypes.oneOf([
//       'primary',
//       'link',
//       'info',
//       'success',
//       'warning',
//       'danger',
//       'dark',
//       'text',
//     ]),
//     PropTypes.string,
//   ]),
//   renderAs: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.string,
//     PropTypes.object,
//   ]),
// };

Icon.defaultProps = {
  renderAs: 'span',
};

Icon.Text = Text;

export default Icon;