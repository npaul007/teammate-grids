import React, { PropsWithChildren } from "react";

interface IProps {
  when: boolean;
}

export const Exist: React.FC<PropsWithChildren<IProps>> = ({
  children,
  when,
}) => <React.Fragment>{when ? children : null}</React.Fragment>;
