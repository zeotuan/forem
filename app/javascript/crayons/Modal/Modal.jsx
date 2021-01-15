import { h } from 'preact';
import PropTypes from 'prop-types';
import { defaultChildrenPropTypes } from '../../common-prop-types';
import { Button, ButtonGroup } from '@crayons';

function getAdditionalClassNames({ size, className }) {
  let additionalClassNames = '';

  if (size && size.length > 0 && size !== 'default') {
    additionalClassNames += ` crayons-modal--${size}`;
  }

  if (className && className.length > 0) {
    additionalClassNames += ` ${className}`;
  }

  return additionalClassNames;
}

const ActionButtons = ({ primaryAction, secondaryAction, type }) => {
  return (
    <ButtonGroup className="crayons-modal__box__button-group">
      <Button
        aria-label="Confirm"
        variant={type ?? 'primary'}
        onClick={primaryAction.onAction}
      >
        {primaryAction.content}
      </Button>
      <Button
        aria-label="Cancel"
        variant="secondary"
        onClick={secondaryAction.onAction}
      >
        {secondaryAction.content}
      </Button>
    </ButtonGroup>
  );
};

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="crayons-icon"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="714d29e78a3867c79b07f310e075e824"
  >
    <title id="714d29e78a3867c79b07f310e075e824">Close</title>
    <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636l4.95 4.95z" />
  </svg>
);

export const Modal = ({
  children,
  size = 'default',
  className,
  title,
  overlay,
  onClose,
  primaryAction,
  secondaryAction,
  type,
}) => {
  return (
    <div
      data-testid="modal-container"
      className={`crayons-modal${getAdditionalClassNames({
        size,
        className,
      })}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="modal"
        className="crayons-modal__box"
      >
        <div
          className={
            title
              ? 'crayons-modal__box__header'
              : 'crayons-modal__box__header-plain'
          }
        >
          {title && title.length > 0 && <h2>{title}</h2>}
          <Button
            icon={CloseIcon}
            variant="ghost"
            contentType="icon"
            aria-label="Close"
            onClick={secondaryAction ? secondaryAction.onAction : onClose}
          />
        </div>
        <div className="crayons-modal__box__body">
          {children}
          {primaryAction && (
            <ActionButtons
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
              type={type}
            />
          )}
        </div>
      </div>
      {overlay && (
        <div data-testid="modal-overlay" className="crayons-modal__overlay" />
      )}
    </div>
  );
};

Modal.displayName = 'Modal';

Modal.defaultProps = {
  className: undefined,
  overlay: true,
  onClose: undefined,
  confirmation: false,
};

Modal.propTypes = {
  children: defaultChildrenPropTypes.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  overlay: PropTypes.bool,
  primaryAction: PropTypes.shape({
    content: PropTypes.string,
    onAction: PropTypes.func,
  }),
  secondaryAction: PropTypes.shape({
    content: PropTypes.string,
    onAction: PropTypes.func,
  }),
  size: PropTypes.oneOf(['default', 's', 'm']).isRequired,
  type: PropTypes.oneOf(['secondary', 'outlined', 'danger', 'primary']),
  url: PropTypes.string,
};
