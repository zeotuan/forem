import { h } from 'preact';
import { defaultChildrenPropTypes } from '../../common-prop-types';

export const ButtonGroup = ({ children, className }) => (
  <div role="presentation" className={`crayons-btn-group ${className}`}>
    {children}
  </div>
);

ButtonGroup.displayName = 'ButtonGroup';

ButtonGroup.propTypes = {
  children: defaultChildrenPropTypes.isRequired,
};
