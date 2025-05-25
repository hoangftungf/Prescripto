import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify';

const UsersList = () => {
  const { users, getAllUsers, deleteUser, aToken } = useContext(AdminContext)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    if (aToken) {
      getAllUsers()
    }
  }, [aToken])

  useEffect(() => {
    // Filter users when users list or search query changes
    if (users) {
      if (searchQuery.trim() === '') {
        setFilteredUsers(users)
      } else {
        const filtered = users.filter(user => 
          user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredUsers(filtered)
      }
    }
  }, [users, searchQuery])

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete)
      setShowDeleteConfirm(false)
      setUserToDelete(null)
    } else {
      toast.error('Error identifying user to delete')
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Users</h1>

      {/* Search bar */}
      <div className='my-4'>
        <div className='relative max-w-xs'>
          <input
            type='text'
            placeholder='Search by name...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
          <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
            <svg className='h-5 w-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' />
            </svg>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg max-w-md w-full'>
            <h3 className='text-lg font-medium mb-3'>Confirm User Deletion</h3>
            <p className='text-gray-600 mb-4'>Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className='flex justify-end gap-3'>
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users list */}
      <div className='w-full mt-5'>
        <table className='min-w-full bg-white divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Phone</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date Joined</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredUsers.map((user, index) => (
              <tr key={index} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='text-sm font-medium text-gray-900'>{user.name}</div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>{user.email}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>{user.phone || 'N/A'}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-500'>
                    {user.date ? new Date(user.date).toLocaleDateString() : 'N/A'}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <button 
                    onClick={() => handleDeleteUser(user._id)} 
                    className='text-red-600 hover:text-red-900'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className='text-center p-5 text-gray-500'>
            {searchQuery.trim() !== '' ? 'No users match your search' : 'No users found'}
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersList
