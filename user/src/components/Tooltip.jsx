import { Tooltip as BsTooltip } from "bootstrap";
import React, { useEffect, useRef } from "react";

export const Tooltip = (p) => {
  const childRef = useRef(undefined);

  useEffect(() => {
    const t = new BsTooltip(childRef.current, {
      title: p.text,
      placement: p.placement,
      trigger: "hover",
    });
    return () => t.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.text]);

  return React.cloneElement(p.children, { ref: childRef });
};
