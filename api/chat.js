export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'กรุณาระบุข้อความ' });
  
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'ยังไม่ได้ตั้งค่า API Key ในระบบหลังบ้าน' });

  try {
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
    });
    const data = await apiResponse.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      return res.status(500).json({ error: 'ไม่สามารถประมวลผลคำตอบได้' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
  }
}
