// api/fetch.js (CommonJS)
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
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*'
            }
        });
        clearTimeout(timeout);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type') || '';
        const rawContent = await response.text();
        
        // KIRIM BALIK APA PUN YANG DIDAPAT (HTML, JS, LUA)
        // Kita tidak perlu filter, biar user lihat mentahannya
        res.status(200).json({ 
            success: true, 
            content: rawContent,
            contentType: contentType,
            url: url,
            note: rawContent.length > 100 ? 'Content received (may include HTML wrapper)' : 'Content is short'
        });
        
    } catch (err) {
        console.error('Fetch error:', err.message);
        res.status(500).json({ error: err.message });
    }
};
