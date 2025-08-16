import { useState, useEffect } from 'react'
import { createClient } from '@zoralabs/coins-sdk'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import './ZoraCoinPage.css'

function ZoraCoinPage() {
  const [coinData, setCoinData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [holders, setHolders] = useState([])
  const [trades, setTrades] = useState([])
  const [chartData, setChartData] = useState([])
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  
  // Zora coin contract address on Base
  const coinAddress = '0x577dCA90068DB5A60782112823bABB32333CC88A'
  
  useEffect(() => {
    async function fetchCoinData() {
      try {
        setLoading(true)
        
        // Create Viem client for Base
        const publicClient = createPublicClient({
          chain: base,
          transport: http()
        })
        
        // Create Zora SDK client
        const zoraClient = createClient()
        
        // Fetch coin data
        const coin = await zoraClient.coin({
          address: coinAddress,
          chain: base.id
        })
        
        setCoinData(coin)
        
        // Fetch holders (mock data for now as SDK doesn't provide this directly)
        setHolders([
          { address: '0x1234...5678', balance: '1,337,000', percentage: '13.37%' },
          { address: '0x8765...4321', balance: '420,690', percentage: '4.21%' },
          { address: '0xabcd...efgh', balance: '314,159', percentage: '3.14%' },
          { address: '0xdead...beef', balance: '271,828', percentage: '2.72%' },
          { address: '0xcafe...babe', balance: '161,803', percentage: '1.62%' }
        ])
        
        // Fetch recent trades (mock data)
        setTrades([
          { type: 'buy', amount: '10,000', price: '0.00042', time: '2 min ago', tx: '0xabc...123' },
          { type: 'sell', amount: '5,000', price: '0.00041', time: '5 min ago', tx: '0xdef...456' },
          { type: 'buy', amount: '25,000', price: '0.00040', time: '12 min ago', tx: '0xghi...789' },
          { type: 'buy', amount: '7,500', price: '0.00039', time: '18 min ago', tx: '0xjkl...012' },
          { type: 'sell', amount: '3,000', price: '0.00038', time: '25 min ago', tx: '0xmno...345' }
        ])
        
        // Generate chart data points
        const points = []
        for (let i = 0; i < 24; i++) {
          points.push({
            time: `${23 - i}h`,
            price: 0.0004 + (Math.random() - 0.5) * 0.00005
          })
        }
        setChartData(points)
        
      } catch (err) {
        console.error('Error fetching coin data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCoinData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchCoinData, 30000)
    return () => clearInterval(interval)
  }, [])
  
  if (loading) {
    return (
      <div className="zora-page-loading">
        <div className="loading-spinner">🟣</div>
        <div className="loading-text">Loading Zora Coin Data...</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="zora-page-error">
        <div className="error-icon">⚠️</div>
        <div className="error-text">Error loading coin data: {error}</div>
      </div>
    )
  }
  
  return (
    <div className="zora-coin-page">
      {/* Header */}
      <header className="zora-header">
        <div className="zora-header-content">
          <div className="zora-logo-section">
            <span className="zora-logo">🟣</span>
            <div className="zora-title">
              <h1>$koHLabs on Zora</h1>
              <p className="zora-subtitle">Creator Coin on Base</p>
            </div>
          </div>
          <nav className="zora-nav">
            <a href="/" className="nav-link">← Back to Main</a>
            <a href="https://zora.co/@koh" target="_blank" rel="noopener noreferrer" className="nav-link">Zora Profile →</a>
          </nav>
        </div>
      </header>
      
      {/* Stats Grid */}
      <section className="zora-stats">
        <div className="stat-card primary">
          <div className="stat-label">Current Price</div>
          <div className="stat-value">$0.000420</div>
          <div className="stat-change positive">+15.42%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Market Cap</div>
          <div className="stat-value">$420.69K</div>
          <div className="stat-change">Base Chain</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Holders</div>
          <div className="stat-value">1,337</div>
          <div className="stat-change">+42 today</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">24h Volume</div>
          <div className="stat-value">$69.42K</div>
          <div className="stat-change">↔️ Trading</div>
        </div>
      </section>
      
      {/* Chart Section - DexScreener Embed */}
      <section className="zora-chart-section">
        <div className="chart-header">
          <h2>Live Price Chart</h2>
          <div className="chart-source">Powered by DexScreener</div>
        </div>
        <div className="dexscreener-embed-container">
          <style>{`
            #dexscreener-embed {
              position: relative;
              width: 100%;
              padding-bottom: 125%;
            }
            @media(min-width: 1400px) {
              #dexscreener-embed {
                padding-bottom: 65%;
              }
            }
            #dexscreener-embed iframe {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              border: 0;
              border-radius: 12px;
            }
          `}</style>
          <div id="dexscreener-embed">
            <iframe 
              src="https://dexscreener.com/base/0x37f383ecfe8942e0c2b4b64853aa65f752dc365c791ba29da8168f2589ec2223?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
              title="DexScreener Chart"
            />
          </div>
        </div>
      </section>
      
      {/* Contract Info */}
      <section className="zora-contract-section">
        <h2>Contract Information</h2>
        <div className="contract-info">
          <div className="contract-item">
            <span className="contract-label">Network:</span>
            <span className="contract-value">Base (Chain ID: 8453)</span>
          </div>
          <div className="contract-item">
            <span className="contract-label">Contract:</span>
            <span className="contract-value">
              <code>{coinAddress}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(coinAddress)}
                className="copy-btn"
              >📋</button>
            </span>
          </div>
          <div className="contract-item">
            <span className="contract-label">Creator:</span>
            <span className="contract-value">koh.eth</span>
          </div>
          <div className="contract-item">
            <span className="contract-label">Total Supply:</span>
            <span className="contract-value">100,000,000 $koHLabs</span>
          </div>
        </div>
      </section>
      
      {/* Holders and Trades */}
      <section className="zora-data-section">
        <div className="data-column">
          <h3>Top Holders</h3>
          <div className="holders-list">
            {holders.map((holder, i) => (
              <div key={i} className="holder-item">
                <span className="holder-rank">#{i + 1}</span>
                <span className="holder-address">{holder.address}</span>
                <span className="holder-balance">{holder.balance}</span>
                <span className="holder-percentage">{holder.percentage}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="data-column">
          <h3>Recent Trades</h3>
          <div className="trades-list">
            {trades.map((trade, i) => (
              <div key={i} className={`trade-item ${trade.type}`}>
                <span className={`trade-type ${trade.type}`}>
                  {trade.type === 'buy' ? '🟢' : '🔴'} {trade.type.toUpperCase()}
                </span>
                <span className="trade-amount">{trade.amount}</span>
                <span className="trade-price">${trade.price}</span>
                <span className="trade-time">{trade.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Buy/Sell Section */}
      <section className="zora-action-section">
        <h2>Trade $koHLabs</h2>
        <div className="action-buttons">
          <a 
            href={`https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${coinAddress}&chain=base`}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn buy"
          >
            Buy on Uniswap
          </a>
          <a 
            href="https://zora.co/@koh"
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn zora"
          >
            View on Zora
          </a>
          <a 
            href={`https://basescan.org/token/${coinAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn explorer"
          >
            View on BaseScan
          </a>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="zora-footer">
        <p>$koHLabs Creator Coin • Building on Base • Powered by Zora</p>
        <p className="footer-links">
          <a href="https://t.me/cryptokoh" target="_blank" rel="noopener noreferrer">Telegram</a>
          <span>•</span>
          <a href="https://x.com/crypto_koh" target="_blank" rel="noopener noreferrer">Twitter</a>
          <span>•</span>
          <a href="https://farcaster.xyz/koh" target="_blank" rel="noopener noreferrer">Farcaster</a>
        </p>
      </footer>
    </div>
  )
}

export default ZoraCoinPage