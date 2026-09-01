import React from "react";
import { Link } from "react-router-dom";

// The experts, advisory and featured-experts grids all used the same portrait
// card with a dark gradient washed over the lower half of the photo, which hid
// the face — the one thing the card exists to show. The photo is now left
// completely clear and the text sits on a solid plate hugging the bottom edge:
// the name alone at rest, the rest of the detail expanding on hover.
//
// Hover is CSS, not React state, so the grid does not re-render on every mouse
// move. Where hover does not exist — phones, tablets — the plate is expanded
// permanently, otherwise those details would be unreachable.
export const PersonCardStyles = () => (
  <style>{`
    .person-card {
      position: relative;
      display: block;
      overflow: hidden;
      height: clamp(280px, 40vw, 380px);
      border-radius: 4px;
      text-decoration: none;
      background: linear-gradient(135deg, #0A1628 0%, #1E293B 100%);
      box-shadow: 0 1px 3px rgba(10, 22, 40, 0.08);
      transition: box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .person-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 18px 40px rgba(10, 22, 40, 0.22);
    }

    /* Advisory keeps its gold frame so the two directories stay distinct. */
    .person-card--advisory { border: 1px solid #C6A962; }
    .person-card--advisory:hover { box-shadow: 0 18px 40px rgba(198, 169, 98, 0.28); }

    .person-card__media {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center top;
      transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .person-card:hover .person-card__media { transform: scale(1.06); }

    .person-card__monogram {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cormorant Garamond', serif;
      font-size: 64px;
      font-weight: 700;
      letter-spacing: 4px;
      color: #C6A962;
      opacity: 0.6;
    }

    .person-card__badge {
      position: absolute;
      top: 16px;
      left: 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #C6A962;
      color: #0A1628;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .person-card__badge i { font-size: 10px; }

    .person-card__cta {
      display: block;
      margin-top: 10px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #C6A962;
    }
    .person-card__cta i { margin-left: 6px; font-size: 9px; }

    /* Solid, so the name reads over any photo without washing the whole card. */
    .person-card__plate {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 10px 20px 12px;
      background: rgba(10, 22, 40, 0.94);
      border-top: 2px solid #C6A962;
      transition: padding-bottom 0.4s ease;
    }
    .person-card:hover .person-card__plate { padding-bottom: 16px; }

    .person-card__name {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(18px, 1.5vw, 21px);
      font-weight: 600;
      line-height: 1.25;
      color: #FFFFFF;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Collapsed at rest; max-height is generous so nothing clips mid-expand. */
    .person-card__more {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
    }
    .person-card:hover .person-card__more { max-height: 150px; opacity: 1; }

    /* One line each: the job titles in this directory run long. */
    .person-card__role {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      color: #C6A962;
      margin: 4px 0 1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .person-card__org {
      font-size: 11px;
      color: #8DA4BE;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .person-card__bio {
      font-size: 12px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.75);
      margin: 8px 0 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* No hover here, so the detail cannot be behind one. */
    @media (hover: none) {
      .person-card__more { max-height: 150px; opacity: 1; }
    }
  `}</style>
);

export const PersonCard = ({ to, name, title, company, bio, avatar, variant, badge }) => {
  const initials = (name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <Link to={to} className={`person-card${variant === "advisory" ? " person-card--advisory" : ""}`}>
      {avatar ? (
        <div className="person-card__media" style={{ backgroundImage: `url(${avatar})` }} />
      ) : (
        <div className="person-card__monogram">{initials}</div>
      )}

      {badge && (
        <span className="person-card__badge">
          <i className="fas fa-award"></i>
          {badge}
        </span>
      )}

      <div className="person-card__plate">
        <h4 className="person-card__name">{name}</h4>
        <div className="person-card__more">
          {title && <p className="person-card__role">{title}</p>}
          {company && <p className="person-card__org">{company}</p>}
          {bio && <p className="person-card__bio">{bio}</p>}
          <span className="person-card__cta">
            View Profile
            <i className="fas fa-arrow-right"></i>
          </span>
        </div>
      </div>
    </Link>
  );
};
