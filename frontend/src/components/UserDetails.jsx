import React from 'react';

export default function UserDetails({ user }) {
  return (
    <div className="p-2 bg-white flex justify-around items-center">
      <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 border-4 border-gray-200" onError={(e)=>{e.target.onerror=null; e.target.src='https://placehold.co/100x100?text=User'}} />
      <h3 className="mt-3 text-xl font-semibold text-gray-800">{user.name}</h3>
    </div>
  );
}
