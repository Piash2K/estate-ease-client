import  { useState, useEffect } from "react";

const AdminProfile = () => {
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
      const res = await fetch("http://localhost:5000/users");
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
        const roomsRes = await fetch("http://localhost:5000/apartments");
        const rooms = await roomsRes.json();
      
        const agreementsRes = await fetch("http://localhost:5000/agreements");
        const agreements = await agreementsRes.json();
        console.log(agreements);
      
        const usersRes = await fetch("http://localhost:5000/users");
        const users = await usersRes.json();
      
        const totalMembers = users.filter((user) => user.role === "member").length; // Calculate total members
      
        setStats({
          totalRooms: rooms.length,
          availableRooms: rooms.length - totalMembers, // Available rooms calculated with totalMembers
          agreements: totalMembers, // Unavailable rooms (members) assigned to agreements
          totalUsers: users.length,
          totalMembers, // Assign total members
        });
      };
      

    fetchAdminData();
    fetchStats();
  }, []);

  if (!isAdmin) {
    return <div className="text-center text-red-500">Unauthorized: You must be an admin to view this page.</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center gap-6">
      <div className="card w-full lg:w-1/2 bg-base-100 shadow-xl">
        <figure className="px-10 pt-10">
          <img src={adminInfo.image} alt="Admin Avatar" className="rounded-full w-32 h-32 object-cover" />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-xl font-bold">{adminInfo.name}</h2>
          <p className="text-sm text-gray-500">{adminInfo.email}</p>
        </div>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Total Rooms</div>
          <div className="stat-value">{stats.totalRooms}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Available Rooms</div>
          <div className="stat-value">
            {stats.availableRooms > 0 ? stats.availableRooms : 0}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Unavailable Rooms (Agreements)</div>
          <div className="stat-value">{stats.agreements}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Members</div>
          <div className="stat-value">{stats.totalMembers}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;