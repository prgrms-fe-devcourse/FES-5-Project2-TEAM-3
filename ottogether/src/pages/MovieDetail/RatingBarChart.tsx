import type { Tables } from '../../supabase/supabase.type';
import S from './RatingBarChart.module.css'

type Review = Tables<'review'>;

const RatingBarChart = (reviews: Review[] | null) => {
  const ratingRange = [1, 2, 3, 4, 5];

  // null 또는 빈 배열일 때 대비해서 항상 0으로 초기화
  const ratingCounts: Record<number, number> = ratingRange.reduce((acc, rating) => {
    acc[rating] = reviews?.filter((r) => r.rating === rating).length ?? 0;
    return acc;
  }, {} as Record<number, number>);

  const maxCount = Math.max(...Object.values(ratingCounts), 1); // 0 나누기 방지

  return (
    <div className={S["rating-bar-chart"]}>
      {ratingRange.map((rating) => {
        const count = ratingCounts[rating] ?? 0;
        const widthPercent = (count / maxCount) * 100;

        return (
          <div className={S["bar-wrapper"]} key={rating}>
            <div className={S["bar-background"]}>
              <div
                className={S["bar-fill"]}
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default RatingBarChart;