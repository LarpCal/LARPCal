import { Route, Routes } from "react-router-dom";

import HomePage from "./views/HomePage";
import NewLarpPage from "./views/CreateLarpPage";
import EditLarpPage from "./views/EditLarpPage";
import LarpDetailPage from "./views/LarpDetailPage";
import LarpListPage from "./views/LarpListPage";
import AdminRoutes from "./admin/AdminRoutes";
import OrgDetailPage from "./views/OrgDetailPage";
import CreateOrgPage from "./views/CreateOrgPage";
import EditOrgPage from "./views/EditOrgPage";
import EditLarpImagePage from "./views/EditLarpImagePage";
import LogOutPage from "./views/LogOutPage";
import EditOrgImagePage from "./views/EditOrgImagePage";
import AboutPage from "./views/AboutPage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import ChangePasswordForm from "./components/Forms/ChangePasswordForm";
import MyProfilePage from "./views/MyProfilePage";
import FollowedOrgs from "./views/FollowedOrgs";
import OrgNewslettersPage from "./views/OrgNewslettersPage";
import NewsletterEditPage from "./views/NewsletterEditPage";
import NewsletterPreviewPage from "./views/NewsletterPreview";
import { useUser } from "./hooks/useUser";

function RoutesList() {
  const { user } = useUser();

  const { username, isAdmin, organization } = user;

  const anonRoutes = (
    <>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route
        path="/auth/password-reset/confirm"
        element={<ChangePasswordForm />}
      />
    </>
  );

  const loginRoutes = (
    <>
      <Route path="/orgs/apply" element={<CreateOrgPage />} />
      <Route path="/orgs/:id/edit" element={<EditOrgPage />} />
      <Route path="/orgs/:id/image" element={<EditOrgImagePage />} />
      <Route path="/orgs/:id/newsletters" element={<OrgNewslettersPage />} />
      <Route
        path="/orgs/:id/newsletters/new"
        element={<NewsletterEditPage />}
      />
      <Route
        path="/orgs/:id/newsletters/:newsletterId"
        element={<NewsletterEditPage />}
      />
      <Route path="/auth/logout" element={<LogOutPage />} />
      <Route path="/my-profile" element={<MyProfilePage />} />
      <Route path="/following" element={<FollowedOrgs />} />
    </>
  );

  const organizerRoutes = (
    <>
      <Route path="/events/:id/edit" element={<EditLarpPage />} />
      <Route path="/events/:id/image" element={<EditLarpImagePage />} />
      <Route path="/events/create" element={<NewLarpPage />} />
    </>
  );

  const adminRoutes = (
    <>
      <Route path="/admin/*" element={<AdminRoutes />} />
    </>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {username ? loginRoutes : anonRoutes}
        {organization ? organizerRoutes : null}
        {isAdmin ? adminRoutes : null}
        {/* <Route path='/events/create' element={<NewEventPage />} /> */}
        <Route path="/orgs/:id" element={<OrgDetailPage />} />
        <Route path="/events" element={<LarpListPage />} />
        <Route path="/events/:id" element={<LarpDetailPage />} />
        <Route path="/newsletters/:id" element={<NewsletterPreviewPage />} />
        {/* <Route path='/demo' element={<DemoHome login={login} />} /> */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default RoutesList;
