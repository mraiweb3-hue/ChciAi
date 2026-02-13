# Clean Sections - Ready to Add

## OpenClaw Section (Clean - No Emoji)

```jsx
const OpenClawSection = () => {
  return (
    <section id="openclaw" style={{ padding: '100px 40px', background: '#030303' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#00D9FF', fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>
          OpenClaw - Vas Vlastni AI Asistent
        </h2>
        <p style={{ color: '#888', fontSize: '1.2rem', textAlign: 'center', marginBottom: '60px' }}>
          Bezpecny AI asistent jako Clawdbot. Vlastni instance pro vasi firmu.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {[
            { title: 'Self-Hosted', desc: 'Data zustavaji u vas' },
            { title: 'Customizovatelny', desc: 'Prizpusobte si ho na miru' },
            { title: 'Open-Source', desc: 'Plna transparentnost kodu' },
            { title: 'GDPR Ready', desc: 'Bezpecnost a compliance' }
          ].map((feature, i) => (
            <div key={i} style={{
              background: '#0f0f0f',
              padding: '30px',
              borderRadius: '15px',
              border: '2px solid rgba(0, 217, 255, 0.2)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#00D9FF', fontSize: '1.3rem', marginBottom: '10px' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#aaa', fontSize: '1rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

## Vibe Coding Section (Clean)

```jsx
const VibeCodingSection = () => {
  const courses = [
    { title: 'Online Kurz', price: '1 490 Kc', desc: '2 hodiny video, Certifikat' },
    { title: 'Workshop', price: '9 900 Kc', desc: 'Puldeni, Do 10 osob' },
    { title: 'Enterprise', price: 'Na miru', desc: 'Custom program, Multi-day' }
  ];

  return (
    <section id="vibe-coding" style={{ padding: '100px 40px', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#00D9FF', fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>
          Vibe Coding - Ovladnete AI
        </h2>
        <p style={{ color: '#888', fontSize: '1.2rem', textAlign: 'center', marginBottom: '60px' }}>
          Naucte se efektivne pouzivat AI. Prompt engineering, workflow optimalizace.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {courses.map((course, i) => (
            <div key={i} style={{
              background: '#0f0f0f',
              padding: '40px',
              borderRadius: '20px',
              border: '2px solid rgba(0, 217, 255, 0.2)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#00D9FF', fontSize: '1.5rem', marginBottom: '10px' }}>
                {course.title}
              </h3>
              <div style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold', margin: '20px 0' }}>
                {course.price}
              </div>
              <p style={{ color: '#aaa', marginBottom: '30px' }}>{course.desc}</p>
              <button style={{
                background: '#00D9FF',
                color: '#030303',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}>
                Koupit nyni
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

## Full Pricing Section (Clean)

```jsx
const PricingSection = () => {
  const plans = [
    {
      name: 'STARTER',
      price: '990 Kc',
      desc: 'Pro OSVC a solo podnikatele',
      features: ['1 integrace', '1000 AI zprav/mes', 'Online kurz zdarma', 'Email support 48h']
    },
    {
      name: 'GROWTH',
      price: '1 990 Kc',
      desc: 'Rostouci byznysy',
      features: ['3 integrace', '5000 AI zprav/mes', 'Znalostni baze', 'Priority support 24h'],
      highlight: true
    },
    {
      name: 'BUSINESS',
      price: '3 990 Kc',
      desc: 'Male firmy 5-20 lidi',
      features: ['Unlimited integrace', '20k AI zprav/mes', 'Voice AI', 'CRM integrace']
    },
    {
      name: 'ENTERPRISE',
      price: '9 990 Kc',
      desc: 'Stredni/velke firmy',
      features: ['Self-hosted', 'Unlimited vse', 'Custom development', 'SLA 99.9%']
    }
  ];

  return (
    <section id="pricing" style={{ padding: '100px 40px', background: '#030303' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ color: '#00D9FF', fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>
          Cenove Balicky
        </h2>
        <p style={{ color: '#888', fontSize: '1.2rem', textAlign: 'center', marginBottom: '60px' }}>
          Zacnete male, postupne pridavame funkce
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{
              background: plan.highlight ? '#00D9FF' : '#0f0f0f',
              padding: '40px',
              borderRadius: '20px',
              border: plan.highlight ? 'none' : '2px solid rgba(0, 217, 255, 0.2)',
              textAlign: 'center',
              transform: plan.highlight ? 'scale(1.05)' : 'scale(1)'
            }}>
              <h3 style={{ color: plan.highlight ? '#030303' : '#00D9FF', fontSize: '1.5rem', marginBottom: '10px' }}>
                {plan.name}
              </h3>
              <div style={{ fontSize: '3rem', color: plan.highlight ? '#030303' : 'white', fontWeight: 'bold', marginBottom: '10px' }}>
                {plan.price}
              </div>
              <p style={{ color: plan.highlight ? 'rgba(3,3,3,0.7)' : '#888', marginBottom: '20px' }}>
                {plan.desc}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', textAlign: 'left' }}>
                {plan.features.map((feature, j) => (
                  <li key={j} style={{
                    color: plan.highlight ? 'rgba(3,3,3,0.8)' : '#aaa',
                    marginBottom: '10px',
                    paddingLeft: '20px',
                    position: 'relative'
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: plan.highlight ? '#030303' : '#00D9FF' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button style={{
                background: plan.highlight ? '#030303' : '#00D9FF',
                color: plan.highlight ? '#00D9FF' : '#030303',
                border: 'none',
                padding: '15px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}>
                Vybrat balicek
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

## Testing Order:
1. ✓ SimplePricingSection (3 cards) - DEPLOYED
2. → PricingSection (full 4 tiers with features)
3. → OpenClawSection
4. → VibeCodingSection
5. → Blog preview
6. → Use Cases
7. → FAQ

Each step: build → test → commit → deploy → verify → next
