import { createExpertDirectoryRouter } from "./experts.routes";

// Same directory endpoints as /api/experts, reading the advisory side of
// IndustryExpert. Read-only: advisory members are added from the admin panel.
export default createExpertDirectoryRouter("ADVISORY");
