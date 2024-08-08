import React from 'react'
import classnames from 'classnames'

const Icon = ({
  name = '',
  outlined = false,
  size = '16px',
  klass = '',
  onClick,
  onKeyDown,
}) => {
  const klasses = classnames(
    {
      'material-icons-outlined': outlined,
      'material-icons': !outlined,
    },
    klass
  )

  return (
    <span
      className={klasses}
      style={{ fontSize: size }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role='img'
      aria-label={name}
    >
      {name}
    </span>
  )
}

export default Icon
