function statusHandler(req, res) {
  res.status(200).json({ status: "ok" });
}

export default statusHandler;
