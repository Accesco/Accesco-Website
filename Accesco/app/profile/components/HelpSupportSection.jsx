'use client';

export default function HelpSupportSection({
  supportTicket,
  setSupportTicket,
  ticketSent,
  setTicketSent,
}) {
  return (
    <div className="settings-card profile-panel-card">
      <div className="settings-card-header">
        <span>Help & Support Center</span>
      </div>

      <div className="support-hero">
        <h3>How can we help you today?</h3>
        <div className="support-buttons">
          <a href="tel:1800123456" className="panel-btn-primary">
            <i className="ri-phone-line" /> Call Support
          </a>
          <a href="mailto:support@accesco.in" className="panel-btn-secondary">
            <i className="ri-mail-line" /> Email Us
          </a>
        </div>
      </div>

      <div className="support-ticket-box">
        <p className="panel-subhead">Raise a Support Ticket</p>
        {ticketSent ? (
          <p className="promo-alert success">
            Ticket submitted! Our customer care will respond within 15 minutes.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setTicketSent(true);
            }}
          >
            <div className="form-group-row">
              <input
                type="text"
                placeholder="Subject / Issue topic"
                value={supportTicket.subject}
                onChange={(e) =>
                  setSupportTicket({ ...supportTicket, subject: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group-row">
              <textarea
                placeholder="Describe your issue or order inquiry..."
                rows={3}
                value={supportTicket.message}
                onChange={(e) =>
                  setSupportTicket({ ...supportTicket, message: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="panel-btn-primary">
              Submit Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
