const CONTRACT_STYLES = `
  .contract-content {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    width: 650px;
    max-width: 650px;
    margin: 0;
    padding: 20px;
    background: white;
  }
  .section-header {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 30px;
    text-align: center;
    border-bottom: 3px solid #3498db;
    padding-bottom: 10px;
  }
  .client-info {
    background: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
  }
  .client-info table { width: 100%; border-collapse: collapse; }
  .client-info td { padding: 6px 0; font-size: 14px; }
  .client-info td:first-child { font-weight: bold; color: #2c3e50; width: 140px; }
  .quote-client-info td { padding: 3px 8px 3px 0; font-size: 12px; }
  .quote-client-info td:first-child,
  .quote-client-info td:nth-child(3) { width: 70px; font-weight: bold; color: #2c3e50; }
  .estimate-item {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    background: #fafafa;
  }
  .item-title {
    font-size: 20px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 15px;
    border-bottom: 1px solid #bdc3c7;
    padding-bottom: 5px;
  }
  .item-description {
    font-size: 14px;
    margin-bottom: 15px;
    color: #34495e;
  }
  .item-description strong { color: #2c3e50; }
  .price {
    font-size: 24px;
    font-weight: bold;
    color: #27ae60;
    text-align: right;
    margin-top: 10px;
  }
  .warranty-box {
    background: #e8f5e8;
    border: 1px solid #27ae60;
    border-radius: 5px;
    padding: 15px;
    margin: 15px 0;
  }
  .warranty-title {
    font-weight: bold;
    color: #27ae60;
    margin-bottom: 5px;
  }
  .total-section {
    background: #2c3e50;
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-top: 30px;
  }
  .total-title { font-size: 18px; margin-bottom: 10px; }
  .total-price { font-size: 32px; font-weight: bold; text-align: right; }
  .summary-section {
    background: #ecf0f1;
    border-radius: 8px;
    padding: 20px;
    margin: 25px 0;
  }
  .summary-section h3 { color: #2c3e50; margin-bottom: 15px; }
  .summary-section table { width: 100%; border-collapse: collapse; }
  .summary-section td { padding: 8px 0; font-size: 14px; }
  .summary-section td:last-child { text-align: right; font-weight: bold; }
  .summary-section tr.total td { font-weight: bold; font-size: 18px; border-top: 2px solid #bdc3c7; padding-top: 15px; margin-top: 10px; }
  .contract-section {
    margin: 25px 0;
    padding: 20px;
    background: #fafafa;
    border-radius: 8px;
    border-left: 4px solid #3498db;
  }
  .contract-section h3 { color: #2c3e50; margin-bottom: 12px; font-size: 16px; }
  .contract-section p, .contract-section li { font-size: 12px; margin-bottom: 8px; }
  .contract-section ul { margin: 10px 0; padding-left: 20px; }
  .signature-section {
    margin-top: 40px;
    padding: 25px;
    border-bottom: 1px solid #bdc3c7;
  }
  .signature-section h3 { color: #2c3e50; margin-bottom: 15px; }
  .signature-line { border-bottom: 1px solid #333; padding: 8px 0; margin: 20px 0; min-width: 200px; }
  .signature-label { font-size: 11px; color: #7f8c8d; margin-top: 4px; }
  .footer-notes {
    margin-top: 30px;
    padding: 20px;
    background: #ecf0f1;
    border-radius: 8px;
    font-size: 12px;
    color: #7f8c8d;
  }
  .estimate-item.optional {
    border-color: #f39c12;
    background: #fef9e7;
  }
`

export function buildContractHTML(data) {
  const {
    projectNumber,
    clientName,
    address,
    phone,
    email,
    projectItems,
    includeLighting,
    lightingOption,
    lightingPrice,
    lightingCustomDescription = '',
    LIGHTING_OPTIONS,
    subtotal,
    subtotalWithLighting,
    discountAmount,
    totalWithoutLights,
    totalWithLights,
    totalBeforeTax,
    includeTax,
    taxAmount,
    total,
    WARRANTY_OPTIONS,
    WARRANTY_TEXT,
    PROJECT_NAME_OPTIONS = [],
    SERVICE_OPTIONS,
    CONTRACT_TERMS,
  } = data

  const getItemDisplayName = (item) => {
    if (item.itemNameSelect === 'other') return item.itemName || 'Other'
    const opt = PROJECT_NAME_OPTIONS.find((o) => o.value === item.itemNameSelect)
    return opt?.label || item.itemName || SERVICE_OPTIONS.find((o) => o.value === item.serviceType)?.label || 'Item'
  }

  const estimateItems = projectItems.map((item) => {
    const itemName = getItemDisplayName(item)
    const itemPrice = parseFloat(item.price || 0)
    const warrantyText = WARRANTY_TEXT[item.warranty]
    const warrantyLabel = WARRANTY_OPTIONS.find((o) => o.value === item.warranty)?.label || ''

    let desc = item.description || 'No description provided.'
    if (item.dimensions) desc = `Dimensions: ${item.dimensions}. ${desc}`
    const descHtml = desc.replace(/\n/g, '<br>')

    const warrantyHtml = warrantyText
      ? `
      <div class="warranty-box">
        <div class="warranty-title">Warranty: ${warrantyLabel}</div>
        ${warrantyText}
      </div>
    `
      : ''

    return `
      <div class="estimate-item">
        <div class="item-title">${escapeHtml(itemName)}</div>
        <div class="item-description">${descHtml}</div>
        ${warrantyHtml}
        <div class="price">$${itemPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      </div>
    `
  }).join('')

  const lightingItemHtml = includeLighting && lightingPrice > 0
    ? `
    <div class="estimate-item optional">
      <div class="item-title">Outdoor Lighting (Optional)</div>
      <div class="item-description">
        ${lightingOption === 'plug_in'
          ? 'LED Plug-In Outdoor Waterproof Lighting System (5 lights included). High-efficiency LED lights designed for outdoor applications. Weather-resistant and energy-efficient, perfect for illuminating walkways, patios, and landscape features.'
          : lightingOption === 'hardwired'
            ? 'Hardwired LED Landscape Lighting (Licensed Electrician Installation). High-efficiency LED lights designed for outdoor applications. Weather-resistant and energy-efficient, perfect for illuminating walkways, patios, and landscape features.'
            : escapeHtml(lightingCustomDescription || 'Custom outdoor lighting installation.').replace(/\n/g, '<br>')}
      </div>
      <div class="price">$${lightingPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
    </div>
  `
    : ''

  const contractSummaryRows = projectItems.map((item, idx) => {
    const itemName = getItemDisplayName(item) || `Item ${idx + 1}`
    const itemPrice = parseFloat(item.price || 0)
    return `<tr><td>${escapeHtml(itemName)}</td><td>$${itemPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>`
  }).join('')

  const lightingSummaryRow = includeLighting && lightingPrice > 0
    ? `<tr><td>Outdoor Lighting (Optional)</td><td>$${lightingPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>`
    : ''

  const paymentText =
    total >= 100000
      ? 'For projects $100,000 or over: 10% deposit upon signing, 25% when materials ordered, 25% on 1st day of project, 25% at half completion, 15% upon completion.'
      : 'For projects under $100,000: Payment terms as agreed. Deposit required upon signing to secure schedule.'

  return `
  <style>${CONTRACT_STYLES}</style>
  <div class="contract-content">
    <div class="section-header">Zero Construction Inc.<br>Construction Contract</div>

    <div class="client-info">
      <table>
        <tr><td>Project #:</td><td>${escapeHtml(projectNumber || '—')}</td></tr>
        <tr><td>Client:</td><td>${escapeHtml(clientName || '—')}</td></tr>
        <tr><td>Address:</td><td>${escapeHtml(address || '—')}</td></tr>
        ${phone ? `<tr><td>Phone:</td><td>${escapeHtml(phone)}</td></tr>` : ''}
        ${email ? `<tr><td>Email:</td><td>${escapeHtml(email)}</td></tr>` : ''}
        <tr><td>Total Estimate:</td><td>$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
      </table>
    </div>

    <div class="section-header" style="font-size: 22px; margin-bottom: 20px;">Project Estimate</div>
    ${estimateItems}
    ${lightingItemHtml}

    <div class="total-section">
      <div class="total-title">Project Total:</div>
      <div class="total-price">$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
    </div>

    <div class="summary-section">
      <h3>Summary</h3>
      <table>
        ${contractSummaryRows}
        ${lightingSummaryRow}
        <tr><td>Subtotal:</td><td>$${(subtotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        ${includeLighting ? `<tr><td>Subtotal with lighting:</td><td>$${(subtotalWithLighting || subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>` : ''}
        <tr><td>Discount:</td><td>-$${(discountAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        <tr class="total"><td>Total without lighting:</td><td>$${(totalWithoutLights ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        ${includeLighting ? `<tr class="total"><td>Total with lighting:</td><td>$${(totalWithLights ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>` : ''}
        ${includeTax ? `<tr><td>Tax (13% HST):</td><td>$${(taxAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>` : ''}
        ${includeTax ? `<tr class="total"><td>Total (incl. tax):</td><td>$${(total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>` : ''}
      </table>
    </div>

    <div class="contract-section">
      <h3>Payment Schedule</h3>
      <p>${paymentText}</p>
    </div>

    <div class="contract-section">
      <h3>General Landscaping Contract</h3>
      <p><strong>The Property</strong></p>
      <p>${CONTRACT_TERMS.theProperty}</p>
      <p><strong>Client Responsibilities</strong></p>
      <p>The Client shall be responsible for:</p>
      <ul>
        ${CONTRACT_TERMS.clientResponsibilities.map((r) => `<li>${r}</li>`).join('')}
      </ul>
      <p><strong>Landscaper Responsibilities</strong></p>
      <p>In performing the Landscaping Services, the Landscaper shall be responsible for:</p>
      <ul>
        ${CONTRACT_TERMS.landscaperResponsibilities.map((r) => `<li>${r}</li>`).join('')}
      </ul>
      <p><strong>Warranty Details</strong></p>
      <p>${CONTRACT_TERMS.warrantyDetails}</p>
      <p>${CONTRACT_TERMS.paymentTerms}</p>
      <p>${CONTRACT_TERMS.governingLaw}</p>
    </div>

    <div class="signature-section">
      <h3>Client Signature</h3>
      <div class="signature-line"></div>
      <div class="signature-label">Sign here</div>
      <div class="signature-label">Date</div>
    </div>

    <div class="signature-section">
      <h3>Zero Construction Inc.</h3>
      <div class="signature-line"></div>
      <div class="signature-label">Sign here</div>
      <div class="signature-label">Date</div>
    </div>

    <div class="footer-notes">
      <strong>Contact Information:</strong><br>
      Zero Construction Inc<br>
      Licensed & Insured
    </div>
  </div>
  `
}

export function buildQuoteHTML(data) {
  const {
    projectNumber,
    clientName,
    address,
    phone,
    email,
    projectItems,
    includeLighting,
    lightingOption,
    lightingPrice,
    lightingCustomDescription = '',
    PROJECT_NAME_OPTIONS = [],
    SERVICE_OPTIONS,
    subtotal,
    subtotalWithLighting,
    discountAmount,
    totalWithoutLights,
    totalWithLights,
    totalBeforeTax,
    includeTax,
    taxAmount,
    total,
    quoteDate,
  } = data

  const getItemDisplayName = (item) => {
    if (item.itemNameSelect === 'other') return item.itemName || 'Other'
    const opt = PROJECT_NAME_OPTIONS.find((o) => o.value === item.itemNameSelect)
    return opt?.label || item.itemName || 'Item'
  }

  const estimateItems = projectItems.map((item) => {
    const itemName = getItemDisplayName(item)
    const itemPrice = parseFloat(item.price || 0)
    let desc = item.description || 'No description provided.'
    if (item.dimensions) desc = `Dimensions: ${item.dimensions}. ${desc}`
    const descHtml = desc.replace(/\n/g, '<br>')

    return `
      <div class="estimate-item">
        <div class="item-title">${escapeHtml(itemName)}</div>
        <div class="item-description">${descHtml}</div>
        <div class="price">$${itemPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      </div>
    `
  }).join('')

  const lightingItemHtml = includeLighting && lightingPrice > 0
    ? `
    <div class="estimate-item optional">
      <div class="item-title">Outdoor Lighting (Optional)</div>
      <div class="item-description">
        ${lightingOption === 'plug_in'
          ? 'LED Plug-In Outdoor Waterproof Lighting System (5 lights included). High-efficiency LED lights designed for outdoor applications. Weather-resistant and energy-efficient, perfect for illuminating walkways, patios, and landscape features.'
          : lightingOption === 'hardwired'
            ? 'Hardwired LED Landscape Lighting (Licensed Electrician Installation). High-efficiency LED lights designed for outdoor applications. Weather-resistant and energy-efficient, perfect for illuminating walkways, patios, and landscape features.'
            : escapeHtml(lightingCustomDescription || 'Custom outdoor lighting installation.').replace(/\n/g, '<br>')}
      </div>
      <div class="price">$${lightingPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
    </div>
  `
    : ''

  const quoteSummaryRows = projectItems.map((item, idx) => {
    const itemName = getItemDisplayName(item) || `Item ${idx + 1}`
    const itemPrice = parseFloat(item.price || 0)
    return `<tr><td>${escapeHtml(itemName)}</td><td>$${itemPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>`
  }).join('')

  const lightingSummaryRow = includeLighting && lightingPrice > 0
    ? `<tr><td>Outdoor Lighting (Optional)</td><td>$${lightingPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>`
    : ''

  const quoteDateStr = quoteDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return `
  <style>${CONTRACT_STYLES}</style>
  <div class="contract-content">
    <div class="section-header">Zero Construction Inc.<br>Project Quote</div>

    <div class="client-info quote-client-info">
      <table>
        <tr><td>Quote #:</td><td>${escapeHtml(projectNumber || '—')}</td><td>Date:</td><td>${quoteDateStr}</td></tr>
        <tr><td>Client:</td><td>${escapeHtml(clientName || '—')}</td><td>Phone:</td><td>${phone || '—'}</td></tr>
        <tr><td>Address:</td><td colspan="3">${escapeHtml(address || '—')}</td></tr>
        ${email ? `<tr><td>Email:</td><td colspan="3">${escapeHtml(email)}</td></tr>` : ''}
      </table>
    </div>

    <div class="section-header" style="font-size: 22px; margin-bottom: 20px;">Project Estimate</div>
    ${estimateItems}
    ${lightingItemHtml}

    <div class="total-section">
      <div class="total-title">Quote Total:</div>
      <div class="total-price">$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
    </div>

    <div class="summary-section">
      <h3>Summary</h3>
      <table>
        ${quoteSummaryRows}
        ${lightingSummaryRow}
        <tr><td>Subtotal:</td><td>$${(subtotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        ${includeLighting ? `<tr><td>Subtotal with lighting:</td><td>$${(subtotalWithLighting || subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>` : ''}
        <tr><td>Discount:</td><td>-$${(discountAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        <tr class="total"><td>Total${includeLighting ? ' (with lighting)' : ''}:</td><td>$${(totalBeforeTax ?? total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        ${includeTax ? `<tr><td>Tax (13% HST):</td><td>$${(taxAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>` : ''}
        ${includeTax ? `<tr class="total"><td>Total (incl. tax):</td><td>$${(total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>` : ''}
      </table>
    </div>

    <div class="footer-notes">
      This is a quote only — not a binding contract. Valid for 30 days.<br>
      Zero Construction Inc · Licensed & Insured
    </div>
  </div>
  `
}

function escapeHtml(text) {
  if (text == null) return ''
  const div = document.createElement('div')
  div.textContent = String(text)
  return div.innerHTML
}
