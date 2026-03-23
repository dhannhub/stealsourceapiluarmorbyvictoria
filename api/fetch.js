// api/fetch.js
module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }
    
    try {
        // Timeout 10 detik
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (LuaFetcher)' }
        });
        clearTimeout(timeout);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type') || '';
        const text = await response.text();
        
        // Cek apakah balikan HTML
        if (text.trim().startsWith('<') || text.includes('<!DOCTYPE')) {
            throw new Error('URL mengembalikan halaman HTML, bukan script Lua.');
        }
        
        res.status(200).json({ success: true, content: text });
    } catch (err) {
        console.error('Fetch error:', err.message);
        res.status(500).json({ error: err.message });
    }
};
