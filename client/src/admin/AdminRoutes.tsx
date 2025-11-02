import { Navigate, Route, Routes } from "react-router-dom";
import LarpsDashboard from "./LarpsDashboard";
import AdminHome from "./AdminHome";
import AdminEditLarp from "./AdminEditLarp";
import LarpDetailPage from "../views/LarpDetailPage";
import OrgsDashboard from "./OrgsDashboard";
import UsersDashboard from "./UsersDashboard";
import AdminEditOrg from "./AdminEditOrg";
import OrgDetailPage from "../views/OrgDetailPage";
import { NewslettersDashboard } from "./NewslettersDashboard";
import { EditNewsletter } from "./EditNewsletter";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminHome />}>
        <Route path="/" element={<Navigate to="events" />} />
        <Route path="/events" element={<LarpsDashboard />} />
        <Route path="/events/:id" element={<LarpDetailPage />} />
        <Route path="/events/:id/edit" element={<AdminEditLarp />} />
        <Route path="/users" element={<UsersDashboard />} />
        <Route path="/orgs" element={<OrgsDashboard />} />
        <Route path="/orgs/:id" element={<OrgDetailPage />} />
        <Route path="/orgs/:id/edit" element={<AdminEditOrg />} />
        <Route path="/newsletters" element={<NewslettersDashboard />} />
        <Route path="/newsletters/:id" element={<EditNewsletter />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
