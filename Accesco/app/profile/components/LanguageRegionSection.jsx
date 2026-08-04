'use client';

export default function LanguageRegionSection({
  selectedLang,
  setSelectedLang,
  selectedCurrency,
  setSelectedCurrency,
  langSaved,
  setLangSaved,
}) {
  return (
    <div className="settings-card profile-panel-card">
      <div className="settings-card-header">
        <span>Language & Regional Settings</span>
      </div>

      <form
        className="lang-region-form"
        onSubmit={(e) => {
          e.preventDefault();
          setLangSaved(true);
          setTimeout(() => setLangSaved(false), 3000);
        }}
      >
        <div className="form-group-row">
          <label>Preferred Language</label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
          </select>
        </div>

        <div className="form-group-row">
          <label>Currency & Region</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            <option value="INR ₹ (India)">INR ₹ (India)</option>
            <option value="USD $ (USA)">USD $ (USA)</option>
            <option value="AED (UAE)">AED (UAE)</option>
          </select>
        </div>

        <button type="submit" className="panel-btn-primary">
          Save Preferences
        </button>
        {langSaved && <p className="promo-alert success">Preferences saved successfully!</p>}
      </form>
    </div>
  );
}
