export function StarRating({ value = 0 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= value ? "text-yellow-400" : "text-gray-300"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}
