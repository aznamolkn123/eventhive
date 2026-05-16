const EventSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div style={{ padding: "16px" }}>
        <div className="skeleton skeleton-text medium"></div>
        <div className="skeleton skeleton-text short"></div>
        <div className="skeleton skeleton-text short"></div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #eee", marginTop: "12px" }}>
          <div className="skeleton" style={{ width: "60px", height: "24px" }}></div>
          <div className="skeleton" style={{ width: "100px", height: "20px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default EventSkeleton;