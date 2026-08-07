'use client';

export default function AccountDetailsSection({
  displayName,
  phone,
  email,
  isEditing,
  editName,
  editPhone,
  editEmail,
  editError,
  setEditName,
  setEditPhone,
  setEditEmail,
  startEditing,
  cancelEditing,
  saveProfileChanges,
}) {
  return (
    <>
      <form className="settings-card details-card" onSubmit={saveProfileChanges}>
        <div className="settings-card-header">
          <span>Account details</span>
          <button type="button" onClick={isEditing ? cancelEditing : startEditing}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="settings-row">
          <span>Name</span>
          {isEditing ? (
            <input
              className="settings-edit-input"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              aria-label="Name"
              autoFocus
            />
          ) : (
            <strong>{displayName}</strong>
          )}
        </div>

        <div className="settings-row">
          <span>Phone</span>
          {isEditing ? (
            <input
              className="settings-edit-input"
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              aria-label="Phone number"
            />
          ) : (
            <strong>{phone}</strong>
          )}
        </div>

        <div className="settings-row">
          <span>Email</span>
          {isEditing ? (
            <input
              className="settings-edit-input"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              aria-label="Email address"
              placeholder="Add email address"
            />
          ) : (
            <strong>{email}</strong>
          )}
        </div>

        {editError && <p className="settings-edit-error">{editError}</p>}

        {isEditing && (
          <div className="settings-actions">
            <button type="submit">Save changes</button>
          </div>
        )}
      </form>

      <article className="settings-card security-card">
        <div className="settings-card-header">
          <span>Security snapshot</span>
        </div>
        <div className="security-row">
          <span>Login</span>
          <div>
            <strong>Protected account</strong>
            <small>Verified by phone and email</small>
          </div>
          <em>
            <i /> Protected
          </em>
        </div>
        <div className="security-row">
          <span>Recovery</span>
          <div>
            <strong>Recovery details</strong>
            <small>Keep your phone number and email updated for safer access</small>
          </div>
        </div>
      </article>
    </>
  );
}
