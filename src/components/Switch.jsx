export default function Switch({ on, onClick, disabled }) {
  return (
    <div
      className={`switch ${on ? 'on' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      role="switch"
      aria-checked={on}
    >
      <div className="switch-knob" />
    </div>
  );
}
