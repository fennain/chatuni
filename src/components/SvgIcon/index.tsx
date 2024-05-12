import React from "react";

interface SvgProps {
  name: string;
  color?: string;
  prefix?: string;
  className?: string;
  onClick?: () => void;
}

const SvgIcon = React.memo((props: SvgProps) => {
  const { name, prefix = "icon", className } = props;

  const symbolId = `#${prefix}-${name}`;

  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      aria-hidden="true"
      onClick={props.onClick}
    >
      <use href={symbolId} />
    </svg>
  );
});

export default SvgIcon;
