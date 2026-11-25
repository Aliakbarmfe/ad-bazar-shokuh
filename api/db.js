export default async function handler(req, res) {
  // آدرس دیتابیس فایربیس شما
  const DATABASE_URL = "https://supercell-583cf-default-rtdb.firebaseio.com";

  // تنظیمات CORS برای دسترسی راحت فرانت‌اند
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category, id } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'دسته‌بندی مشخص نشده است' });
  }

  // ساخت مسیر دقیق در Realtime Database
  let targetUrl = `${DATABASE_URL}/products/${category}.json`;
  if (id) {
    targetUrl = `${DATABASE_URL}/products/${category}/${id}.json`;
  }

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'خطا در ارتباط با دیتابیس', details: error.message });
  }
}
