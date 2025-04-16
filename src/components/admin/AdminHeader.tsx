import { useUser } from "@/hooks/useUser";

export default function AdminHeader() {
  const { user } = useUser();
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="font-bold text-blue-900 text-xl">Admin Dashboard</div>
      <div className="flex items-center gap-6">
        {/* Notifications placeholder */}
        <button className="relative text-gray-700 hover:text-blue-700">
          <span className="material-icons">notifications</span>
        </button>
        {/* Current user info */}
        {user && (
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              {user.profile?.avatarUrl ? (
                <img src={user.profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </span>
            <span className="text-gray-700 font-semibold">
              {user.profile?.firstName || user.profile?.lastName
                ? `${user.profile?.firstName ?? ''} ${user.profile?.lastName ?? ''}`.trim()
                : user.username}
            </span>
            <button className="ml-4 bg-red-50 text-red-700 px-3 py-1 rounded hover:bg-red-100 transition font-semibold">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
