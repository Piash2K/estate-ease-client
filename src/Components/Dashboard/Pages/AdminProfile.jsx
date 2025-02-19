import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../Provider/AuthProvider";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    agreements: 0,
    totalUsers: 0,
    totalMembers: 0,
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      const res = await fetch("https://estate-ease-server.vercel.app/users");
      const users = await res.json();

      const admin = users.find((user) => user.role === "admin");
      if (admin) {
        setIsAdmin(true);
        setAdminInfo({
          name: admin.displayName,
          email: admin.email,
          image: admin.image,
        });
      }
    };

    const fetchStats = async () => {
      const roomsRes = await fetch("https://estate-ease-server.vercel.app/apartments");
      const rooms = await roomsRes.json();

      const agreementsRes = await fetch("https://estate-ease-server.vercel.app/agreements");
      const agreements = await agreementsRes.json();
      console.log(agreements)

      const usersRes = await fetch("https://estate-ease-server.vercel.app/users");
      const users = await usersRes.json();

      const totalMembers = users.filter((user) => user.role === "member").length;

      setStats({
        totalRooms: rooms.length,
        availableRooms: rooms.length - totalMembers,
        agreements: totalMembers,
        totalUsers: users.length,
        totalMembers,
      });
    };

    fetchAdminData();
    fetchStats();
  }, []);

  if (!isAdmin) {
    return <div className="text-center text-red-500">Unauthorized: You must be an admin to view this page.</div>;
  }

  // Data for charts
  const roomData = [
    { name: "Total Rooms", value: stats.totalRooms },
    { name: "Available Rooms", value: stats.availableRooms },
    { name: "Unavailable Rooms", value: stats.agreements },
  ];

  const userData = [
    { name: "Total Users", value: stats.totalUsers },
    { name: "Total Members", value: stats.totalMembers },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Helmet>
        <title>Admin Profile | EstateEase</title>
      </Helmet>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <img src={user.photoURL} alt="Admin Avatar" className="w-12 h-12 rounded-full" />
          <div>
            <p className="text-lg font-semibold">{adminInfo.name}</p>
            <p className="text-sm text-gray-500">{adminInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500">Total Rooms</p>
          <p className="text-2xl font-bold">{stats.totalRooms}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500">Available Rooms</p>
          <p className="text-2xl font-bold">{stats.availableRooms}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500">Unavailable Rooms</p>
          <p className="text-2xl font-bold">{stats.agreements}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Availability Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Room Availability</h2>
          <BarChart width={500} height={300} data={roomData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        {/* User Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={userData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {userData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;