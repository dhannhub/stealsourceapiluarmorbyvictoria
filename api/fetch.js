// api/fetch.js
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing url parameter' });
    
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });
        clearTimeout(timeout);
        
        const rawHtml = await response.text();
        
        // KEMBALIKAN HTML MENTAH (bukan JSON error)
        res.status(200).json({ 
            success: true, 
            html: rawHtml,
            url: url,
            length: rawHtml.length
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
