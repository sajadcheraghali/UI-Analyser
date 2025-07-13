import MetricCard from './MetricCard';

export default function AnalysisResult({ data }) {
  return (
    <div className="analysis-result">
      <h2>نتایج تحلیل برای {data.url}</h2>
      
      <div className="metrics-grid">
        <MetricCard 
          title="سرعت بارگذاری" 
          value={data.loadTime} 
          unit="ms" 
          rating={data.loadTimeRating}
        />
        
        <MetricCard 
          title="تعداد درخواست‌ها" 
          value={data.requestCount} 
          rating={data.requestCountRating}
        />
        
        <MetricCard 
          title="حجم صفحه" 
          value={data.pageSize} 
          unit="KB" 
          rating={data.pageSizeRating}
        />
        
        <MetricCard 
          title="تعداد عناصر DOM" 
          value={data.domSize} 
          rating={data.domSizeRating}
        />
        
        <MetricCard 
          title="دسترسی‌پذیری" 
          value={data.accessibilityScore} 
          unit="/100" 
          rating={data.accessibilityRating}
        />
        
        <MetricCard 
          title="واکنش‌گرایی" 
          value={data.responsiveScore} 
          unit="/100" 
          rating={data.responsiveRating}
        />
      </div>
      
      <style jsx>{`
        .analysis-result {
          margin-top: 2rem;
          padding: 1rem;
          border: 1px solid #eee;
          border-radius: 8px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}