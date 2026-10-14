function RatingStar({defaultValue}) {
  const roundedValue = Math.round(defaultValue);

  return (
    <span className="rating-stars" aria-label={`${defaultValue} / 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= roundedValue ? "star-filled" : ""}>★</span>
      ))}
    </span>
  )
}

export default RatingStar
