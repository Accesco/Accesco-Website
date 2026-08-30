'use client';

export default function AddressesSection({
  addresses,
  showAddressForm,
  setShowAddressForm,
  newAddr,
  setNewAddr,
  handleAddAddress,
  setDefaultAddress,
  deleteAddress,
}) {
  return (
    <div className="settings-card profile-panel-card">
      <div className="settings-card-header">
        <span>Saved Delivery Addresses ({addresses.length})</span>
        <button type="button" onClick={() => setShowAddressForm(!showAddressForm)}>
          {showAddressForm ? 'Cancel' : '+ Add Address'}
        </button>
      </div>

      {showAddressForm && (
        <form className="address-form-box" onSubmit={handleAddAddress}>
          <p className="panel-subhead">Add New Address</p>
          <div className="form-group-row">
            <label>Tag</label>
            <select
              value={newAddr.tag}
              onChange={(e) => setNewAddr({ ...newAddr, tag: e.target.value })}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group-row">
            <label>House / Flat / Bldg</label>
            <input
              type="text"
              placeholder="e.g. Flat 402, Royal Palms"
              value={newAddr.flat}
              onChange={(e) => setNewAddr({ ...newAddr, flat: e.target.value })}
              required
            />
          </div>
          <div className="form-group-row">
            <label>Street / Area</label>
            <input
              type="text"
              placeholder="e.g. 10th Main, Koramangala"
              value={newAddr.street}
              onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
              required
            />
          </div>
          <div className="form-group-row">
            <label>City & Pincode</label>
            <div className="flex-inputs">
              <input
                type="text"
                placeholder="City"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Pincode"
                value={newAddr.pincode}
                onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="panel-btn-primary">
            Save Address
          </button>
        </form>
      )}

      {addresses.length === 0 && !showAddressForm ? (
        <div className="empty-panel-state">
          <i className="ri-map-pin-line empty-panel-icon" />
          <h4>No Saved Delivery Addresses</h4>
          <p>You haven't saved any addresses yet. Add your home or office address for fast 1-click checkout.</p>
          <button type="button" className="panel-btn-primary" onClick={() => setShowAddressForm(true)}>
            + Add Delivery Address
          </button>
        </div>
      ) : (
        <div className="address-list">
          {addresses.map((addr) => (
            <div key={addr.id} className={`address-item ${addr.isDefault ? 'is-default' : ''}`}>
              <div className="address-item-header">
                <div className="address-tag-wrap">
                  <span className="address-tag-badge">{addr.tag}</span>
                  {addr.isDefault && <span className="default-badge">DEFAULT</span>}
                </div>
                <div className="address-actions">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      className="btn-text"
                      onClick={() => setDefaultAddress(addr.id)}
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-text btn-danger"
                    onClick={() => deleteAddress(addr.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="address-name-phone">
                <strong>{addr.name}</strong> · {addr.phone}
              </p>
              <p className="address-details">
                {addr.flat}, {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
