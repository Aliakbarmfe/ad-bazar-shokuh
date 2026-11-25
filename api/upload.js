export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // افزایش محدودیت حجم برای آپلود عکس‌های باکیفیت
    },
  },
};

export default async function handler(req, res) {
  const IMGBB_API_KEY = "32b44cf4a92e03d876d7d02104feabfb";

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'فقط متد POST مجاز است' });
  }

  try {
    const { image } = req.body; // دریافت عکس به صورت Base64

    if (!image) {
      return res.status(400).json({ error: 'عکسی ارسال نشده است' });
    }

    // حذف پیشوند data:image/...;base64, در صورت وجود
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const formData = new URLSearchParams();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Data);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ url: data.data.url });
    } else {
      return res.status(400).json({ error: 'خطا در آپلود به imgbb', details: data });
    }
  } catch (error) {
    return res.status(500).json({ error: 'خطای سرور در آپلود عکس', details: error.message });
  }
}
