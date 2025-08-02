import S from "./SystemSettings.module.css";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleSwitch({ label, checked, onChange }: ToggleProps) {
  return (
    <div className={S["toggle"]}>
      <span>{label}</span>
      <button
        className={`${S["switch"]} ${checked ? S["switch-on"] : S["switch-off"]}`}
        onClick={onChange}
      >
        <span className={S["knob"]}></span>
      </button>
    </div>
  );
}

export default ToggleSwitch;