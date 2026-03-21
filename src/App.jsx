import { useState } from 'react'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
import { buildContractHTML, buildQuoteHTML } from './ContractTemplate'
import { LandingPage } from './LandingPage'
import './App.css'

const WARRANTY_OPTIONS = [
  { value: '', label: 'Select warranty' },
  { value: '30_days', label: '30 Days' },
  { value: '90_days', label: '90 Days' },
  { value: '1_year', label: '1 Year' },
  { value: '2_years', label: '2 Years' },
  { value: '3_years', label: '3 Years' },
  { value: '5_years', label: '5 Years' },
]

const WARRANTY_TEXT = {
  '30_days': 'Zero Construction Inc. provides a 30-day warranty on this work and workmanship. Any installation defects during this period will be addressed and repaired at no additional cost, excluding normal wear and tear.',
  '90_days': 'Zero Construction Inc. provides a 90-day warranty on this work and workmanship. Any installation defects during this period will be addressed and repaired at no additional cost, excluding normal wear and tear.',
  '1_year': 'Zero Construction Inc. provides a 1-year warranty on this work and workmanship. Any installation defects during this period will be addressed and repaired at no additional cost, excluding normal wear and tear.',
  '2_years': 'Zero Construction Inc. provides a 2-year warranty on this work and workmanship. Any cracking, settling, or installation defects during this period will be addressed and repaired at no additional cost, excluding normal wear and tear.',
  '3_years': 'Zero Construction Inc. provides a 3-year warranty on this work and workmanship. Any settling, shifting, or installation defects during this period will be addressed and repaired at no additional cost, excluding normal wear and tear.',
  '5_years': 'Zero Construction Inc. provides a 5-year warranty on this work and workmanship. Any installation defects during this period will be addressed and repaired at no additional cost, excluding normal wear and tear.',
}

const CONTRACT_TERMS = {
  theProperty: 'The Property: The Client warrants and represents that the Client either owns the Property or otherwise has the lawful authority to engage the Landscaper for the Landscaping Services requested on the Property. The Client shall promptly provide evidence of the same upon the request of the Landscaper.',
  clientResponsibilities: [
    'Accurately apprise the Landscaper as to the property lines of the Property',
    'Accurately apprise the Landscaper as to any subsurface utility and service lines',
    'Obtaining any permits as required to perform the Landscaping Services',
    'Provide necessary space for storage of materials required for the project',
    'Submit government issued driver\'s license prior to project start date',
    'Purchasing the materials',
  ],
  landscaperResponsibilities: [
    'The provision of the Landscaping Services in a workmanlike manner',
    'Cleaning of the Property and removal of all debris after performing the Landscaping Services',
  ],
  warrantyDetails: 'Landscaper warrants new installation and workmanship for the period selected per project item. This warranty covers structural defects and installation issues but excludes normal wear and tear, acts of nature, and damage from heavy vehicles beyond normal use. This warranty shall not apply to any damage caused by settling due to new construction, installation of utility lines or other excavations, negligence, abuse, misuse, misapplication, unauthorized modifications, normal wear and tear, acts of god, unforeseen site conditions, or any other factor beyond the control of the Landscaper.',
  paymentTerms: 'Payment Terms: Payment shall be made by cash. In the event the Client fails to make payment in accordance with this Agreement, the Landscaper will be entitled to stop all work immediately and reserves all legal rights and remedies.',
  governingLaw: 'Governing Law: This Agreement and the interpretation of its terms shall be governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein.',
}

const LIGHTING_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'plug_in', label: 'LED Plug-In (5 lights) - $1,000', price: 1000 },
  { value: 'hardwired', label: 'Hardwired LED (Licensed Electrician) - $1,500', price: 1500 },
  { value: 'custom', label: 'Custom price', price: 0 },
]

const PROJECT_NAME_OPTIONS = [
  { value: '', label: 'Select project' },
  { value: 'interlock_installation', label: 'Interlock installation', description: 'Professional excavation and base preparation, followed by the installation of interlocking pavers for driveways, walkways, or patios.' },
  { value: 'retaining_wall_installation', label: 'Retaining wall installation', description: 'Construction of structural or decorative retaining walls using specialized blocks or stones to manage grades and enhance landscaping.' },
  { value: 'deck_installation', label: 'Deck installation', description: 'Custom design and construction of outdoor decks using wood or composite materials, including structural framing, decking boards, and stairs.' },
  { value: 'fence_installation', label: 'Fence installation', description: 'Supply and installation of residential fencing (wood, vinyl, or metal) for privacy and property demarcation.' },
  { value: 'asphalt_installation', label: 'Asphalt installation', description: 'Grading and paving of surfaces with high-grade asphalt, ensuring proper drainage and a smooth finish for driveways or paths.' },
  { value: 'natural_stone_installation', label: 'Natural stone installation', description: 'Artistic and structural installation of natural stone (flagstone, slate, etc.) for high-end walkways, steps, or decorative features.' },
  { value: 'railing_installation', label: 'Railing installation', description: 'Secure installation of safety and decorative railings for decks, stairs, or porches, compliant with local safety standards.' },
  { value: 'drainage_pipes_installation', label: 'Drainage pipes installation', description: 'Implementation of sub-surface drainage systems, including French drains or downspout extensions, to manage water runoff effectively.' },
  { value: 'sodding_installation', label: 'Sodding installation', description: 'Site preparation including grading and topsoil, followed by the installation of fresh, high-quality grass sod for an instant lawn.' },
  { value: 'armour_stone_installation', label: 'Armour stone installation', description: 'Placement of large-scale natural armour stones for erosion control, shoreline protection, or heavy-duty landscaping aesthetics.' },
  { value: 'flagstone_installation', label: 'Flagstone installation', description: 'Expert placement of natural flagstone for walkways, patios, or porch overlays, often used for a high-end, organic look.' },
  { value: 'pot_lights_landscape_lighting', label: 'Pot lights & landscape lighting', description: 'Installation of low-voltage LED landscape lighting to illuminate paths, gardens, or exterior walls for safety and curb appeal.' },
  { value: 'garden_bed_construction', label: 'Garden bed construction', description: 'Design and build of raised garden beds using timber, stone, or composite materials, including soil filling and planting.' },
  { value: 'steps_porch_overlays', label: 'Steps & porch overlays', description: 'Construction or renovation of exterior steps and porches using natural stone, concrete, or interlock materials.' },
  { value: 'driveway_sealing', label: 'Driveway sealing', description: 'Application of professional-grade sealant to asphalt or interlock surfaces to protect against weather damage and restore appearance.' },
  { value: 'grading_levelling', label: 'Grading & levelling', description: 'Professional site grading to ensure proper water runoff and prepare surfaces for landscaping or sodding.' },
  { value: 'disposal_of_debris', label: 'Disposal of debris (waste management & site cleanup)', description: 'Comprehensive removal and disposal of all project-related construction debris, surplus materials, and hazardous waste from the property.' },
  { value: 'paint', label: 'Paint', description: 'Professional preparation of surfaces, including minor patching and sanding, followed by high-quality primer and finish paint application for walls, ceilings, or trim.' },
  { value: 'tile', label: 'Tile', description: 'Precision installation of tiles for floors or walls, including surface preparation, layout design, thin-set application, grouting, and sealing.' },
  { value: 'floor', label: 'Floor', description: 'Installation of various flooring materials (hardwood, laminate, vinyl, or engineered wood), including underlayment and transition moldings.' },
  { value: 'kitchen_renovation', label: 'Kitchen renovation', description: 'Full or partial remodeling of kitchen space, covering cabinetry installation, countertop fitting, plumbing updates, and backsplash tiling.' },
  { value: 'bathroom_renovation', label: 'Bathroom renovation', description: 'Comprehensive bathroom upgrading, including waterproofing, plumbing fixture updates, shower/tub installation, and vanity fitting.' },
  { value: 'basement_renovation', label: 'Basement renovation', description: 'Finishing or remodeling of basement areas to create livable space, including framing, insulation, drywall, and interior finishing.' },
  { value: 'other', label: 'Other' },
]

const SERVICE_OPTIONS = [
  { value: '', label: 'Select service type' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'remodeling', label: 'Remodeling' },
  { value: 'new_construction', label: 'New Construction' },
  { value: 'repair', label: 'Repair' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'custom', label: 'Custom' },
]

const defaultProjectItem = (isQuote) => ({
  id: crypto.randomUUID(),
  itemNameSelect: '',
  itemName: '',
  serviceType: '',
  dimensions: '',
  description: '',
  price: '',
  warranty: isQuote ? undefined : '',
})

function App() {
  const [mode, setMode] = useState(null)
  const [projectNumber, setProjectNumber] = useState(() =>
    String(Math.floor(100000 + Math.random() * 900000))
  )
  const [clientName, setClientName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [isReferral, setIsReferral] = useState(false)
  const [referralName, setReferralName] = useState('')
  const [includeLighting, setIncludeLighting] = useState(false)
  const [lightingOption, setLightingOption] = useState('')
  const [lightingCustomPrice, setLightingCustomPrice] = useState('')
  const [lightingCustomDescription, setLightingCustomDescription] = useState('')
  const [discount, setDiscount] = useState('')
  const [includeTax, setIncludeTax] = useState(false)
  const [projectItems, setProjectItems] = useState([defaultProjectItem(false)])
  const [isGenerating, setIsGenerating] = useState(false)

  const isQuote = mode === 'quote'

  const addProjectItem = () => {
    setProjectItems([...projectItems, defaultProjectItem(isQuote)])
  }

  const removeProjectItem = (id) => {
    if (projectItems.length > 1) {
      setProjectItems(projectItems.filter((item) => item.id !== id))
    }
  }

  const updateProjectItem = (id, field, value) => {
    setProjectItems(
      projectItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const updateProjectItemFields = (id, updates) => {
    setProjectItems(
      projectItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }

  const subtotal = projectItems.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  )
  const lightingPrice = includeLighting
    ? (lightingOption === 'custom'
        ? parseFloat(lightingCustomPrice) || 0
        : LIGHTING_OPTIONS.find((o) => o.value === lightingOption)?.price || 0)
    : 0
  const subtotalWithLighting = subtotal + lightingPrice
  const discountAmount = parseFloat(discount) || 0
  const totalWithoutLights = Math.max(0, subtotal - discountAmount)
  const totalWithLights = Math.max(0, subtotalWithLighting - discountAmount)
  const totalBeforeTax = includeLighting ? totalWithLights : totalWithoutLights
  const taxAmount = includeTax ? totalBeforeTax * 0.13 : 0
  const total = totalBeforeTax + taxAmount

  const buildData = () => ({
    projectNumber,
    clientName,
    address,
    phone,
    email,
    projectItems,
    includeLighting,
    lightingOption,
    lightingPrice,
    lightingCustomPrice,
    lightingCustomDescription,
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
    quoteDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    PROJECT_NAME_OPTIONS,
    SERVICE_OPTIONS,
  })

  const openPrintView = () => {
    const buildFn = isQuote ? buildQuoteHTML : buildContractHTML
    const data = isQuote ? buildData() : { ...buildData(), WARRANTY_OPTIONS, WARRANTY_TEXT, CONTRACT_TERMS }
    const html = buildFn(data)
    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html><html><head><meta charset="UTF-8"><title>${isQuote ? 'Quote' : 'Contract'}</title></head>
      <body>${html}</body></html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 500)
  }

  const generateImage = async () => {
    setIsGenerating(true)
    const buildFn = isQuote ? buildQuoteHTML : buildContractHTML
    const data = isQuote ? buildData() : { ...buildData(), WARRANTY_OPTIONS, WARRANTY_TEXT, CONTRACT_TERMS }
    const html = buildFn(data)

    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);'
    const msg = document.createElement('div')
    msg.textContent = 'Generating image...'
    msg.style.cssText = 'background:white;padding:24px 48px;border-radius:8px;font-size:18px;font-weight:600;color:#1a3a52;'
    wrapper.appendChild(msg)

    const container = document.createElement('div')
    container.innerHTML = html
    container.style.cssText = 'position:fixed;left:50%;top:20px;transform:translateX(-50%);width:650px;background:white;z-index:99998;box-shadow:0 0 20px rgba(0,0,0,0.3);overflow:visible;'
    document.body.appendChild(wrapper)
    document.body.appendChild(container)

    const contentEl = container.querySelector('.contract-content') || container

    try {
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 500)))
      const canvas = await html2canvas(contentEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })
      const link = document.createElement('a')
      link.download = isQuote ? 'Zero_Construction_Quote.png' : 'Zero_Construction_Contract.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      document.body.removeChild(container)
      document.body.removeChild(wrapper)
      setIsGenerating(false)
    }
  }

  const generatePDF = async () => {
    setIsGenerating(true)
    const buildFn = isQuote ? buildQuoteHTML : buildContractHTML
    const data = isQuote ? buildData() : { ...buildData(), WARRANTY_OPTIONS, WARRANTY_TEXT, CONTRACT_TERMS }
    const html = buildFn(data)

    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);'
    const msg = document.createElement('div')
    msg.textContent = 'Generating PDF...'
    msg.style.cssText = 'background:white;padding:24px 48px;border-radius:8px;font-size:18px;font-weight:600;color:#1a3a52;'
    wrapper.appendChild(msg)

    const container = document.createElement('div')
    container.innerHTML = html
    container.style.cssText = 'position:fixed;left:50%;top:0;transform:translateX(-50%);width:650px;background:white;z-index:99998;box-shadow:0 0 20px rgba(0,0,0,0.3);'
    document.body.appendChild(wrapper)
    document.body.appendChild(container)

    const contentEl = container.querySelector('.contract-content') || container

    try {
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 500)))
      await html2pdf()
        .set({
          margin: 10,
          filename: isQuote ? 'Zero_Construction_Quote.pdf' : 'Zero_Construction_Contract.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 1, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(contentEl)
        .save()
    } finally {
      document.body.removeChild(container)
      document.body.removeChild(wrapper)
      setIsGenerating(false)
    }
  }

  if (!mode) {
    return <LandingPage onSelect={setMode} />
  }

  return (
    <div className="app">
      <header className="header">
        <button type="button" className="btn-back" onClick={() => setMode(null)}>
          ← Back
        </button>
        <h1>Zero Construction</h1>
        <p>{isQuote ? 'Quote Generator' : 'Contract Generator'}</p>
      </header>

      <main className="main">
        <section className={`section ${isQuote ? 'quote-compact' : ''}`}>
          <h2>Client Information</h2>
          <div className="form-grid">
            <div className="field">
              <label>{isQuote ? 'Quote' : 'Project'} #</label>
              <input
                type="text"
                value={projectNumber}
                onChange={(e) => setProjectNumber(e.target.value)}
                placeholder="e.g. 656005"
              />
            </div>
            <div className="field">
              <label>Client Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className="field full-width">
              <label>Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, State, ZIP"
              />
            </div>
            <div className="field">
              <label>Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="field">
              <label>Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@email.com"
              />
            </div>
            {!isQuote && (
              <div className="field full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isReferral}
                    onChange={(e) => setIsReferral(e.target.checked)}
                  />
                  Referred by a friend
                </label>
                {isReferral && (
                  <input
                    type="text"
                    value={referralName}
                    onChange={(e) => setReferralName(e.target.value)}
                    placeholder="Friend's name (optional)"
                    className="referral-input"
                  />
                )}
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <h2>Scope of Work</h2>
          {projectItems.map((item) => (
            <div key={item.id} className="project-item">
              <div className="project-item-header">
                <span>Item #{projectItems.indexOf(item) + 1}</span>
                <button
                  type="button"
                  onClick={() => removeProjectItem(item.id)}
                  disabled={projectItems.length === 1}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label>Project Name</label>
                  <select
                    value={item.itemNameSelect}
                    onChange={(e) => {
                      const val = e.target.value
                      const opt = PROJECT_NAME_OPTIONS.find((o) => o.value === val)
                      updateProjectItemFields(item.id, {
                        itemNameSelect: val,
                        ...(opt?.description && { description: opt.description }),
                      })
                    }}
                  >
                    {PROJECT_NAME_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {item.itemNameSelect === 'other' && (
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) =>
                        updateProjectItem(item.id, 'itemName', e.target.value)
                      }
                      placeholder="Enter project name"
                      className="custom-input-margin"
                    />
                  )}
                </div>
                <div className="field">
                  <label>Service Type</label>
                  <select
                    value={item.serviceType}
                    onChange={(e) =>
                      updateProjectItem(item.id, 'serviceType', e.target.value)
                    }
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Dimensions (optional)</label>
                  <input
                    type="text"
                    value={item.dimensions}
                    onChange={(e) =>
                      updateProjectItem(item.id, 'dimensions', e.target.value)
                    }
                    placeholder="e.g. 10ft x 12ft"
                  />
                </div>
                <div className="field full-width">
                  <label>Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) =>
                      updateProjectItem(item.id, 'description', e.target.value)
                    }
                    placeholder="Auto-filled from project name above, or type custom. Fully editable."
                    rows={3}
                    className="custom-input-margin"
                  />
                </div>
                <div className="field">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      updateProjectItem(item.id, 'price', e.target.value)
                    }
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) updateProjectItem(item.id, 'price', val.toFixed(2))
                    }}
                    placeholder="0.00"
                  />
                </div>
                {!isQuote && (
                  <div className="field">
                    <label>Warranty</label>
                    <select
                      value={item.warranty || ''}
                      onChange={(e) =>
                        updateProjectItem(item.id, 'warranty', e.target.value)
                      }
                    >
                      {WARRANTY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addProjectItem} className="btn-add">
            + Add Item
          </button>
        </section>

        <section className="section">
          <h2>Payment Summary</h2>
          <div className="summary-row">
            <span>Subtotal (without lighting):</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="optional-lighting">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeLighting}
                onChange={(e) => {
                  setIncludeLighting(e.target.checked)
                  if (e.target.checked && !lightingOption) setLightingOption('plug_in')
                }}
              />
              Outdoor Lighting (Optional)
            </label>
            {includeLighting && (
              <div className="lighting-options">
                <select
                  value={lightingOption}
                  onChange={(e) => setLightingOption(e.target.value)}
                >
                  {LIGHTING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {lightingOption === 'custom' && (
                  <>
                    <div className="field">
                      <label>Custom Description</label>
                      <input
                        type="text"
                        value={lightingCustomDescription}
                        onChange={(e) => setLightingCustomDescription(e.target.value)}
                        placeholder="e.g. Custom outdoor lighting installation"
                      />
                    </div>
                    <div className="field">
                      <label>Custom Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={lightingCustomPrice}
                        onChange={(e) => setLightingCustomPrice(e.target.value)}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value)
                          if (!isNaN(val)) setLightingCustomPrice(val.toFixed(2))
                        }}
                        placeholder="0.00"
                      />
                    </div>
                  </>
                )}
                <div className="summary-row lighting-price">
                  <span>Lighting:</span>
                  <span>${lightingPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {includeLighting && (
            <div className="summary-row">
              <span>Subtotal with lighting:</span>
              <span>${subtotalWithLighting.toFixed(2)}</span>
            </div>
          )}

          <div className="field discount-field">
            <label>Discount ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              onBlur={(e) => {
                const val = parseFloat(e.target.value)
                if (!isNaN(val)) setDiscount(val.toFixed(2))
              }}
              placeholder="0.00"
            />
          </div>

          {isQuote && (
            <div className="field tax-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeTax}
                  onChange={(e) => setIncludeTax(e.target.checked)}
                />
                Include 13% HST
              </label>
              {includeTax && (
                <div className="summary-row">
                  <span>Tax (13%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <div className="summary-row total">
            <span>Total{includeLighting ? ' (with lighting)' : ''}:</span>
            <span>${totalBeforeTax.toFixed(2)}</span>
          </div>
          {includeTax && (
            <>
              <div className="summary-row">
                <span>Tax (13% HST):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total (incl. tax):</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </>
          )}
        </section>

        <div className="download-buttons">
          <button
            type="button"
            onClick={generateImage}
            className="btn-download btn-download-primary"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Download PNG (recommended — full content)'}
          </button>
          <button
            type="button"
            onClick={generatePDF}
            className="btn-download"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            type="button"
            onClick={openPrintView}
            className="btn-print-fallback"
          >
            Open in New Window (use Ctrl/Cmd+P to Save as PDF)
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
