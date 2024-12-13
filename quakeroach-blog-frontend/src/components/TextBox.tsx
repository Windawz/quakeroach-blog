import combineClassName from '../lib/combineClassName';
import './styles/TextBox.css';

export type TextBoxProps = MultiLineTextBoxProps | SingleLineTextBoxProps;

export interface MultiLineTextBoxProps extends BaseTextBoxProps {
  kind: "multiLine";
}

export interface SingleLineTextBoxProps extends BaseTextBoxProps {
  kind: "singleLine";
  type: "text" | "password";
}

interface BaseTextBoxProps {
  className?: string;
  name?: string;
  label?: string;
  onChange?: (value: string) => void;
}

export default function TextBox(props: TextBoxProps) {
  const className = combineClassName(
    "text-box",
    props.className,
    props.kind === "singleLine"
      ? "text-box-single-line"
      : undefined
  );

  const label = props.label === undefined
    ? undefined
    : (
      <label className="text-box-label">
        {props.label}
      </label>
    );

  return (
    <>
      <div className="text-box-container">
        {label}
        {props.kind === "singleLine"
          ? (
            <input
              className={className}
              type={props.type}
              inputMode="text"
              name={props.name}
              onChange={e => {
                if (props.onChange !== undefined) {
                  props.onChange(e.target.value)
                }
              }} />
          )
          : (
            <textarea
              className={className}
              inputMode="text"
              name={props.name}
              onChange={e => {
                if (props.onChange !== undefined) {
                  props.onChange(e.target.value)
                }
              }} />
          )}
      </div>
    </>
  );
}