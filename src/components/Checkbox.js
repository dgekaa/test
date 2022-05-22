import React from "react";
import styled, { keyframes } from "styled-components";
import { COLORS } from "../other/constants";

const rotate = keyframes`
 from {
    opacity: 0;
    transform: rotate(0deg);
  }
  to {
    opacity: 1;
    transform: rotate(45deg);
  }
`;

const Input = styled.input`
    height: 0;
    width: 0;
    opacity: 0;
    z-index: -1;
  `,
  Label = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  `,
  Indicator = styled.div`
    width: 20px;
    height: 20px;
    background: ${COLORS.DARK};
    margin-left: 10px;
    margin-top: 5px;
    border: 2px solid ${COLORS.LIGHT};
    border-radius: 2px;
    ${Input}:not(:disabled):checked & {
      background: #d1d1d1;
    }
    ${Label}:hover & {
      opacity: 0.8;
    }
    &::after {
      content: "";
      display: none;
    }
    ${Input}:checked + &::after {
      display: block;
      width: 32%;
      height: 55%;
      border: solid ${COLORS.LIGHT};
      border-width: 0 3px 3px 0;
      animation-name: ${rotate};
      animation-duration: 0.3s;
      animation-fill-mode: forwards;
      margin-left: 4px;
    }
    &::disabled {
      cursor: not-allowed;
    }
  `;

export const Checkbox = ({
  value,
  checked,
  onChange,
  name,
  id,
  label,
  disabled,
}) => (
  <Label htmlFor={id} disabled={disabled}>
    {label}
    <Input
      id={id}
      type="checkbox"
      name={name}
      value={value}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
    />
    <Indicator />
  </Label>
);
