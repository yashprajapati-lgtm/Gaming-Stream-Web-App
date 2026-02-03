function StreamCard({ title, streamer, viewers }) {
  return (
    <div className="card">
      <img src="https://via.placeholder.com/300x180" />
      <h3>{title}</h3>
      <p>{streamer}</p>
      <p>{viewers} viewers</p>
    </div>
  );
}

export default StreamCard;
