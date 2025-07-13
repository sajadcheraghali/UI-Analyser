export default function MetricCard({ title, value, unit = '', rating }) {
    const getRatingColor = () => {
      switch(rating) {
        case 'good': return '#4CAF50';
        case 'average': return '#FFC107';
        case 'poor': return '#F44336';
        default: return '#9E9E9E';
      }
    };
  
    return (
      <div className="metric-card">
        <h3>{title}</h3>
        <div className="metric-value">
          {value} {unit}
        </div>
        <div className="metric-rating" style={{ backgroundColor: getRatingColor() }}>
          {rating === 'good' && 'عالی'}
          {rating === 'average' && 'متوسط'}
          {rating === 'poor' && 'ضعیف'}
        </div>
        
        <style jsx>{`
          .metric-card {
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .metric-value {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0.5rem 0;
          }
          .metric-rating {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            color: white;
            font-size: 0.8rem;
          }
        `}</style>
      </div>
    );
  }