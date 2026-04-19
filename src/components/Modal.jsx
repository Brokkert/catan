export default function Modal({ onClose, children, title }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {title && (
          <div className="row between mb">
            <h2 style={{ margin: 0 }}>{title}</h2>
            <button className="btn-secondary" onClick={onClose} style={{ padding: '4px 10px' }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
