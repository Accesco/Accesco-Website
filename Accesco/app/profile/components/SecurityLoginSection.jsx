'use client';

export default function SecurityLoginSection({
  passwordForm,
  setPasswordForm,
  passMsg,
  handlePasswordSubmit,
  twoFactor,
  setTwoFactor,
}) {
  return (
    <div className="settings-card profile-panel-card">
      <div className="settings-card-header">
        <span>Security & Account Login</span>
      </div>

      <form className="security-pass-form" onSubmit={handlePasswordSubmit}>
        <p className="panel-subhead">Update Password</p>
        <div className="form-group-row">
          <label>Current Password</label>
          <input
            type="password"
            value={passwordForm.current}
            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
          />
        </div>
        <div className="form-group-row">
          <label>New Password</label>
          <input
            type="password"
            value={passwordForm.next}
            onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
          />
        </div>
        <div className="form-group-row">
          <label>Confirm Password</label>
          <input
            type="password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
          />
        </div>
        <button type="submit" className="panel-btn-primary">
          Update Password
        </button>
        {passMsg && <p className="promo-alert info">{passMsg}</p>}
      </form>

      <div className="security-sub-section">
        <div className="notif-row">
          <div>
            <strong>Two-Factor Authentication (2FA)</strong>
            <small>Add an extra layer of security requiring SMS OTP at login</small>
          </div>
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={() => setTwoFactor(!twoFactor)}
          />
        </div>
      </div>
    </div>
  );
}
