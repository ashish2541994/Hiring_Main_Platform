import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiMail, FiCalendar, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";

const PlatformProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const profileItems = [
    {
      icon: FiUser,
      label: "Name",
      value:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Not set",
    },
    {
      icon: FiMail,
      label: "Email",
      value: user.email || "Not set",
    },
    {
      icon: FiCalendar,
      label: "Member Since",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A",
    },
    {
      icon: FiShield,
      label: "Role",
      value: user.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a14] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-slate-400 mb-8">
            Manage your Vidhidhruv Solutions account information
          </p>

          <div className="bg-[#1e1e32]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            {/* Avatar Section */}
            <div className="p-6 md:p-8 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                  {(user.firstName?.[0] || "U") + (user.lastName?.[0] || "")}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Account Details
              </h3>
              <div className="space-y-4">
                {profileItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
                    >
                      <div className="p-2 rounded-lg bg-indigo-500/10">
                        <ItemIcon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                          {item.label}
                        </p>
                        <p className="text-sm text-slate-200 mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 md:p-8 border-t border-white/10 bg-white/[0.02]">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
                >
                  Back to Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 text-sm font-medium transition-colors"
                >
                  Account Settings
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformProfile;
