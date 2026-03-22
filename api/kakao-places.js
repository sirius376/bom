export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const keyword = req.query.keyword || '벚꽃 명소';
  const page = parseInt(req.query.page || 1);

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}&size=15&page=${page}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_JS_KEY}`,
        },
      }
    );

    const data = await response.json();

    const places = (data.documents || []).map(p => ({
      name: p.place_name,
      address: p.address_name,
      lat: parseFloat(p.y),
      lng: parseFloat(p.x),
      url: p.place_url,
      category: p.category_name,
    }));

    res.status(200).json({
      places,
      isEnd: data.meta?.is_end,
      total: data.meta?.total_count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
