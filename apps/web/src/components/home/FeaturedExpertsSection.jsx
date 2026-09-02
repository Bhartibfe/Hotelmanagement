import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAosRefresh } from "../../lib/hooks/useAosRefresh";
import { SectionSkeleton, SkeletonCards } from "../common/Skeleton";
import { PersonCard, PersonCardStyles } from "../common/PersonCard";
import { ErrorNotice } from "../common/ErrorNotice";


export const FeaturedExpertsSection = ({ config }) => {
  const [experts, setExperts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  // A failed fetch and an empty list used to look identical: the section just
  // disappeared. They mean very different things, so they are tracked apart.
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoaded(false);
    setError(null);
    api.getFeaturedExperts()
      .then((data) => setExperts(Array.isArray(data) ? data : []))
      .catch((err) => setError(err))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => { load(); }, [load]);

  useAosRefresh(loaded);

  // Hold the section's height while loading so the page does not jump
  if (!loaded) {
    return (
      <SectionSkeleton padding="clamp(48px, 6vw, 72px) 0" background="#FFFFFF">
        <SkeletonCards count={config?.featuredExpertsCount || 4} columnClass="col-6 col-md-6 col-lg-3" height="clamp(200px, 46vw, 380px)" />
      </SectionSkeleton>
    );
  }

  if (error) {
    return (
      <section style={{ padding: "clamp(48px, 6vw, 72px) 0", background: "#FFFFFF" }}>
        <div className="container" style={{ maxWidth: "640px" }}>
          <ErrorNotice error={error} title="Featured experts could not be loaded" onRetry={load} />
        </div>
      </section>
    );
  }

  if (experts.length === 0) return null;

  return (
    <section style={{ padding: "clamp(48px, 6vw, 72px) 0", background: "#FFFFFF" }}>
      <PersonCardStyles />
      <div className="container">
        {/* Section Header */}
        <div className="row align-items-end" style={{ marginBottom: "36px" }}>
          <div className="col-lg-8">
            <span
              data-aos="fade-right"
              data-aos-duration="800"
              style={{
                color: "#C6A962",
                letterSpacing: "3px",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                marginBottom: "16px",
              }}
            >
              Hospitality Leaders
            </span>
            <h2
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontFamily: "var(--tg-heading-font-family)",
                fontWeight: 600,
                color: "#0A1628",
              }}
            >
              Industry Experts
            </h2>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link
              to="/experts"
              className="btn btn-two"
              data-aos="fade-left"
              data-aos-duration="800"
              style={{ padding: "14px 28px", fontSize: "12px" }}
            >
              View All Experts
            </Link>
          </div>
        </div>

        {/* Expert Cards */}
        {loaded && <div className="row home-card-grid">
          {experts.slice(0, config?.featuredExpertsCount || 4).map((expert, index) => (
            <div
              key={expert.id}
              className="col-6 col-md-6 col-lg-3"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 100}
              style={{ marginBottom: "20px" }}
            >
              <PersonCard
                to={`/experts/${expert.id}`}
                name={`${expert.user?.firstName || ""} ${expert.user?.lastName || ""}`.trim()}
                title={expert.user?.title}
                company={expert.user?.organizationName}
                bio={expert.bio}
                avatar={expert.user?.avatar}
              />
            </div>
          ))}
        </div>}
      </div>
    </section>
  );
};
