import React, { useState, useEffect, useRef } from "react";
import { ErrorNotice } from "../common/ErrorNotice";
import { downscaleImage } from "../../lib/downscaleImage";
import RichTextEditor from "./RichTextEditor";

const EVENT_TYPES = [
  { value: "CONFERENCE", label: "Conference" },
  { value: "SUMMIT", label: "Summit" },
  { value: "NETWORKING", label: "Networking" },
  { value: "WEBINAR", label: "Webinar" },
];

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E2DDD5",
  fontSize: "14px",
  outline: "none",
  background: "#FFFFFF",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#0A1628",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.3px",
};

const CreateEventForm = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("CONFERENCE");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [agenda, setAgenda] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setType(initialData.type || "CONFERENCE");
      setDescription(initialData.description || "");
      setVenue(initialData.venue || "");
      setCity(initialData.city || "");
      setState(initialData.state || "");
      setStartDate(initialData.startDate ? initialData.startDate.split("T")[0] : "");
      setEndDate(initialData.endDate ? initialData.endDate.split("T")[0] : "");
      setMaxAttendees(initialData.maxAttendees || "");
      setRegistrationUrl(initialData.registrationUrl || "");
      setCoverImage(initialData.coverImage || "");
      setOrganizerName(initialData.organizerName || "");
      setHighlights(initialData.highlights || []);
      setAgenda(initialData.agenda || "");
    }
  }, [initialData]);

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB."); return; }
    const reader = new FileReader();
    // Downscaled before it is stored: cover images were the largest things in
    // the database at 0.8-1.8MB each, and they are never shown above 1600px.
    reader.onload = async (ev) => setCoverImage(await downscaleImage(ev.target.result, "cover"));
    reader.onerror = () => setError("That file could not be read. Try selecting it again.");
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const addHighlight = () => {
    if (highlightInput.trim() && highlights.length < 10) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput("");
    }
  };

  const removeHighlight = (i) => {
    setHighlights(highlights.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) { setError("Title is required."); return; }
    if (!description.trim() && description !== "<br>") { setError("Description is required."); return; }
    if (!city.trim()) { setError("City is required."); return; }
    if (!state.trim()) { setError("State is required."); return; }
    if (!startDate) { setError("Start date is required."); return; }
    if (!endDate) { setError("End date is required."); return; }
    if (new Date(endDate) < new Date(startDate)) {
      setError("The end date is before the start date. Swap them, or set both to the same day for a single-day event.");
      return;
    }
    if (maxAttendees && (!/^\d+$/.test(String(maxAttendees)) || parseInt(maxAttendees, 10) < 1)) {
      setError("Maximum attendees must be a whole number of 1 or more. Leave it blank for no limit.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        type,
        description,
        venue: venue.trim() || null,
        city: city.trim(),
        state: state.trim(),
        startDate,
        endDate,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        registrationUrl: registrationUrl.trim() || null,
        coverImage: coverImage || null,
        organizerName: organizerName.trim() || null,
        highlights,
        agenda: agenda || null,
      });
      // Reset
      if (!initialData) {
        setTitle(""); setType("CONFERENCE"); setDescription(""); setVenue("");
        setCity(""); setState(""); setStartDate(""); setEndDate("");
        setMaxAttendees(""); setRegistrationUrl(""); setCoverImage("");
        setOrganizerName(""); setHighlights([]); setAgenda("");
      }
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ marginBottom: "16px" }}>
          <ErrorNotice error={error} onDismiss={() => setError(null)} compact />
        </div>
      )}

      {/* Cover Image */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Cover Image</label>
        {!coverImage ? (
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: "100%", height: "160px", border: "2px dashed #E2DDD5",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              cursor: "pointer", background: "#FAFAFA", transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C6A962"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2DDD5"; }}
          >
            <i className="fas fa-image" style={{ fontSize: "28px", color: "#C6A962", marginBottom: "8px" }}></i>
            <span style={{ fontSize: "13px", color: "#64748B" }}>Click to upload cover image</span>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            <img src={coverImage} alt="Cover" style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} />
            <button type="button" onClick={() => setCoverImage("")} style={{
              position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.6)",
              color: "#FFF", border: "none", width: "28px", height: "28px", borderRadius: "50%",
              cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>&times;</button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverChange} style={{ display: "none" }} />
      </div>

      {/* Title + Type */}
      <div className="row" style={{ marginBottom: "20px" }}>
        <div className="col-md-8">
          <label style={labelStyle}>Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" style={inputStyle} maxLength={200} />
        </div>
        <div className="col-md-4">
          <label style={labelStyle}>Type *</label>
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: "20px" }}>
        <RichTextEditor value={description} onChange={setDescription} label="Description *" placeholder="Describe your event..." minHeight={150} />
      </div>

      {/* Venue, City, State */}
      <div className="row" style={{ marginBottom: "20px" }}>
        <div className="col-md-4">
          <label style={labelStyle}>Venue</label>
          <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. The Taj Mahal Palace" style={inputStyle} />
        </div>
        <div className="col-md-4">
          <label style={labelStyle}>City *</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" style={inputStyle} />
        </div>
        <div className="col-md-4">
          <label style={labelStyle}>State *</label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. Maharashtra" style={inputStyle} />
        </div>
      </div>

      {/* Dates + Max Attendees */}
      <div className="row" style={{ marginBottom: "20px" }}>
        <div className="col-md-4">
          <label style={labelStyle}>Start Date *</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
        </div>
        <div className="col-md-4">
          <label style={labelStyle}>End Date *</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
        </div>
        <div className="col-md-4">
          <label style={labelStyle}>Max Attendees</label>
          <input type="number" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} placeholder="Unlimited" style={inputStyle} min="1" />
        </div>
      </div>

      {/* Registration URL + Organizer */}
      <div className="row" style={{ marginBottom: "20px" }}>
        <div className="col-md-6">
          <label style={labelStyle}>Registration URL</label>
          <input type="url" value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
        </div>
        <div className="col-md-6">
          <label style={labelStyle}>Organizer Name</label>
          <input type="text" value={organizerName} onChange={(e) => setOrganizerName(e.target.value)} placeholder="e.g. Hotel Sircle" style={inputStyle} />
        </div>
      </div>

      {/* Highlights */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Highlights</label>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input
            type="text"
            value={highlightInput}
            onChange={(e) => setHighlightInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
            placeholder="Add a highlight and press Enter"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button type="button" onClick={addHighlight} style={{
            padding: "12px 20px", background: "#C6A962", color: "#0A1628", border: "none",
            fontSize: "12px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px",
          }}>Add</button>
        </div>
        {highlights.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: "#F8FAFC", border: "1px solid #E2DDD5" }}>
                <i className="fas fa-check" style={{ color: "#C6A962", fontSize: "11px" }}></i>
                <span style={{ flex: 1, fontSize: "14px", color: "#0A1628" }}>{h}</span>
                <button type="button" onClick={() => removeHighlight(i)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "14px" }}>&times;</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agenda */}
      <div style={{ marginBottom: "24px" }}>
        <RichTextEditor value={agenda} onChange={setAgenda} label="Agenda / Schedule" placeholder="Add event schedule, speakers, sessions..." minHeight={150} />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{
            padding: "12px 28px", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px",
            textTransform: "uppercase", background: "none", color: "#64748B", border: "1px solid #E2DDD5", cursor: "pointer",
          }}>Cancel</button>
        )}
        <button type="submit" disabled={saving} style={{
          padding: "12px 32px", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px",
          textTransform: "uppercase", background: saving ? "#D4C48A" : "#C6A962", color: "#0A1628",
          border: "none", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px",
        }}>
          {saving && <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "12px" }}></i>}
          {initialData ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;
