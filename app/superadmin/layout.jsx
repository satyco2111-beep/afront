import SuperAdminHeader from "../component/superadmin/SuperAdminHeader";

export default function SuperAdminLayout({ children }) {
  return (
    <>
      <SuperAdminHeader />
      {children}
    </>
  );
}
