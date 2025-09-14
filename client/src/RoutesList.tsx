import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "./context/userContext";

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
// import DemoHome from "./views/DemoHome";
import AboutPage from "./views/AboutPage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import ChangePasswordForm from "./components/Forms/ChangePasswordForm";
import MyProfilePage from "./views/MyProfilePage";

function RoutesList() {
  const { user, login, register, logout } = useContext(userContext);

  const { username, isAdmin, organization } = user;

  const anonRoutes = (
    <>
      <Route path="/auth/login" element={<LoginPage login={login} />} />
      <Route
        path="/auth/register"
        element={<RegisterPage register={register} />}
      />
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
      <Route path="/auth/logout" element={<LogOutPage logOut={logout} />} />
      <Route path="/my-profile" element={<MyProfilePage />} />
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
        {organization ? organizerRoutes : ""}
        {isAdmin ? adminRoutes : ""}
        {/* <Route path='/events/create' element={<NewEventPage />} /> */}
        <Route path="/orgs/:id" element={<OrgDetailPage />} />
        <Route path="/events" element={<LarpListPage />} />
        <Route path="/events/:id" element={<LarpDetailPage />} />
        {/* <Route path='/demo' element={<DemoHome login={login} />} /> */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default RoutesList;
